import { Repository, FindManyOptions, Like, In } from 'typeorm';
import { Route, RouteStatus, DifficultyColor, HoldColorCategory } from '../database/entities/Route';
import { ValidationStatus } from '../database/entities/Validation';
import { AppDataSource } from '../database/data-source';
import { AppError, NotFoundError, ForbiddenError } from '../utils/errors';

export interface RouteFilters {
  difficulty?: string | string[];
  holdColorCategory?: string | string[];
  sector?: string | string[];
  status?: RouteStatus | RouteStatus[];
  search?: string;
  openerId?: string;
}

export interface RouteSortOptions {
  field?: 'createdAt' | 'openedAt' | 'name' | 'difficulty';
  order?: 'ASC' | 'DESC';
}

export interface RouteCreateData {
  name: string;
  difficulty: DifficultyColor;
  holdColorHex: string;
  holdColorCategory: HoldColorCategory;
  sector: string;
  routeTypes?: string[];
  description?: string;
  tips?: string;
  mainPhoto: string;
  openingVideo?: string;
  openerId: string;
}

export interface RouteUpdateData {
  name?: string;
  difficulty?: DifficultyColor;
  holdColorHex?: string;
  holdColorCategory?: HoldColorCategory;
  sector?: string;
  routeTypes?: string[];
  description?: string;
  tips?: string;
  mainPhoto?: string;
  openingVideo?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

class RoutesService {
  private routeRepository: Repository<Route>;

  constructor() {
    this.routeRepository = AppDataSource.getRepository(Route);
  }

  async getRoutes(
    filters: RouteFilters = {},
    sort: RouteSortOptions = {},
    page: number = 1,
    limit: number = 12
  ): Promise<PaginatedResponse<Route>> {
    const queryBuilder = this.routeRepository
      .createQueryBuilder('route')
      .leftJoinAndSelect('route.opener', 'opener')
      .loadRelationCountAndMap(
        'route.validationsCount',
        'route.validations',
        'validation',
        (qb) => qb.where('validation.status = :status', { status: ValidationStatus.VALIDE })
      )
      .loadRelationCountAndMap('route.commentsCount', 'route.comments');

    // Apply filters
    if (filters.difficulty) {
      const difficulties = Array.isArray(filters.difficulty) ? filters.difficulty : [filters.difficulty];
      queryBuilder.andWhere('route.difficulty IN (:...difficulties)', { difficulties });
    }

    if (filters.holdColorCategory) {
      const colors = Array.isArray(filters.holdColorCategory) ? filters.holdColorCategory : [filters.holdColorCategory];
      queryBuilder.andWhere('route.holdColorCategory IN (:...colors)', { colors });
    }

    if (filters.sector) {
      const sectors = Array.isArray(filters.sector) ? filters.sector : [filters.sector];
      queryBuilder.andWhere('route.sector IN (:...sectors)', { sectors });
    }

    if (filters.status) {
      const statuses = Array.isArray(filters.status) ? filters.status : [filters.status];
      queryBuilder.andWhere('route.status IN (:...statuses)', { statuses });
    }

    if (filters.openerId) {
      queryBuilder.andWhere('route.openerId = :openerId', { openerId: filters.openerId });
    }

    if (filters.search) {
      queryBuilder.andWhere(
        '(route.name ILIKE :search OR route.description ILIKE :search OR route.tips ILIKE :search)',
        { search: `%${filters.search}%` }
      );
    }

    // Apply sorting
    const sortField = sort.field || 'createdAt';
    const sortOrder = sort.order || 'DESC';
    queryBuilder.orderBy(`route.${sortField}`, sortOrder);

    // Pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    // Execute query
    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getRouteById(id: string): Promise<Route> {
    const route = await this.routeRepository
      .createQueryBuilder('route')
      .leftJoinAndSelect('route.opener', 'opener')
      .leftJoinAndSelect('route.validations', 'validations')
      .leftJoinAndSelect('route.comments', 'comments')
      .leftJoinAndSelect('comments.user', 'commentUser')
      .loadRelationCountAndMap(
        'route.validationsCount',
        'route.validations',
        'validation',
        (qb) => qb.where('validation.status = :status', { status: ValidationStatus.VALIDE })
      )
      .where('route.id = :id', { id })
      .getOne();

    if (!route) {
      throw new NotFoundError('Route not found');
    }

    return route;
  }

  async createRoute(data: RouteCreateData): Promise<Route> {
    const route = this.routeRepository.create({
      ...data,
      status: RouteStatus.PENDING,
      openedAt: new Date(),
    });

    return await this.routeRepository.save(route);
  }

  async updateRoute(id: string, userId: string, userRole: string, data: RouteUpdateData): Promise<Route> {
    const route = await this.getRouteById(id);

    // Check permissions: Only the opener or admin can update
    if (route.openerId !== userId && userRole !== 'ADMIN') {
      throw new ForbiddenError('You do not have permission to update this route');
    }

    Object.assign(route, data);
    return await this.routeRepository.save(route);
  }

  async deleteRoute(id: string, userRole: string): Promise<void> {
    // Only admin can delete
    if (userRole !== 'ADMIN') {
      throw new ForbiddenError('Only admins can delete routes');
    }

    const route = await this.getRouteById(id);
    await this.routeRepository.remove(route);
  }

  async updateRouteStatus(id: string, status: RouteStatus, userRole: string): Promise<Route> {
    // Only admin can change status
    if (userRole !== 'ADMIN') {
      throw new ForbiddenError('Only admins can change route status');
    }

    const route = await this.getRouteById(id);
    route.status = status;

    if (status === RouteStatus.ARCHIVED && !route.closedAt) {
      route.closedAt = new Date();
    }

    return await this.routeRepository.save(route);
  }

  async getRoutesStats(): Promise<any> {
    const totalRoutes = await this.routeRepository.count();
    const activeRoutes = await this.routeRepository.count({ where: { status: RouteStatus.ACTIVE } });
    const pendingRoutes = await this.routeRepository.count({ where: { status: RouteStatus.PENDING } });
    const archivedRoutes = await this.routeRepository.count({ where: { status: RouteStatus.ARCHIVED } });

    // Get routes by difficulty
    const routesByDifficulty = await this.routeRepository
      .createQueryBuilder('route')
      .select('route.difficulty', 'difficulty')
      .addSelect('COUNT(*)', 'count')
      .where('route.status = :status', { status: RouteStatus.ACTIVE })
      .groupBy('route.difficulty')
      .getRawMany();

    // Get routes by hold color
    const routesByColor = await this.routeRepository
      .createQueryBuilder('route')
      .select('route.holdColorCategory', 'color')
      .addSelect('COUNT(*)', 'count')
      .where('route.status = :status', { status: RouteStatus.ACTIVE })
      .groupBy('route.holdColorCategory')
      .getRawMany();

    return {
      total: totalRoutes,
      active: activeRoutes,
      pending: pendingRoutes,
      archived: archivedRoutes,
      byDifficulty: routesByDifficulty,
      byColor: routesByColor,
    };
  }
}

export const routesService = new RoutesService();
