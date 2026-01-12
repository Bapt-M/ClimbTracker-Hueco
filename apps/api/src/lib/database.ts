import { AppDataSource } from '../database/data-source';
import { User } from '../database/entities';
import { Route } from '../database/entities';
import { Validation } from '../database/entities';
import { Comment } from '../database/entities';
import { Video } from '../database/entities';
import { Analysis } from '../database/entities';

// Export repositories for easy access
export const getUserRepository = () => AppDataSource.getRepository(User);
export const getRouteRepository = () => AppDataSource.getRepository(Route);
export const getValidationRepository = () => AppDataSource.getRepository(Validation);
export const getCommentRepository = () => AppDataSource.getRepository(Comment);
export const getVideoRepository = () => AppDataSource.getRepository(Video);
export const getAnalysisRepository = () => AppDataSource.getRepository(Analysis);

// Export the datasource
export { AppDataSource };
