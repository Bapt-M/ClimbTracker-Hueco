import { Repository } from 'typeorm';
import { AppDataSource } from '../database/data-source';
import { GymLayout } from '../database/entities/GymLayout';

export interface GymLayoutInput {
  name: string;
  svgContent: string;
  sectorMappings?: {
    [sectorId: string]: {
      label: string;
      pathId: string;
      coordinates?: { x: number; y: number };
    };
  };
}

class GymLayoutService {
  private layoutRepository: Repository<GymLayout>;

  constructor() {
    this.layoutRepository = AppDataSource.getRepository(GymLayout);
  }

  /**
   * Get the currently active gym layout
   */
  async getActiveLayout(): Promise<GymLayout | null> {
    const layout = await this.layoutRepository.findOne({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
    });

    return layout;
  }

  /**
   * Get gym layout by name
   */
  async getLayoutByName(name: string): Promise<GymLayout | null> {
    const layout = await this.layoutRepository.findOne({
      where: { name },
    });

    return layout;
  }

  /**
   * Create or update a gym layout
   * If a layout with the same name exists, it will be updated
   * Otherwise, a new layout will be created
   */
  async createOrUpdateLayout(data: GymLayoutInput): Promise<GymLayout> {
    // Check if layout with this name already exists
    let layout = await this.layoutRepository.findOne({
      where: { name: data.name },
    });

    if (layout) {
      // Update existing layout
      layout.svgContent = data.svgContent;
      layout.sectorMappings = data.sectorMappings;
    } else {
      // Create new layout
      layout = this.layoutRepository.create({
        name: data.name,
        svgContent: data.svgContent,
        sectorMappings: data.sectorMappings,
        isActive: true, // New layouts are active by default
      });
    }

    return await this.layoutRepository.save(layout);
  }

  /**
   * Set a layout as active (and deactivate others)
   */
  async setActiveLayout(layoutId: string): Promise<GymLayout> {
    const layout = await this.layoutRepository.findOne({
      where: { id: layoutId },
    });

    if (!layout) {
      throw new Error('Layout not found');
    }

    // Deactivate all layouts
    await this.layoutRepository.update({}, { isActive: false });

    // Activate the selected layout
    layout.isActive = true;
    return await this.layoutRepository.save(layout);
  }

  /**
   * Get all gym layouts
   */
  async getAllLayouts(): Promise<GymLayout[]> {
    const layouts = await this.layoutRepository.find({
      order: { createdAt: 'DESC' },
    });

    return layouts;
  }

  /**
   * Delete a gym layout
   */
  async deleteLayout(layoutId: string): Promise<void> {
    const layout = await this.layoutRepository.findOne({
      where: { id: layoutId },
    });

    if (!layout) {
      throw new Error('Layout not found');
    }

    // Don't allow deleting the active layout without setting another one as active
    if (layout.isActive) {
      const otherLayouts = await this.layoutRepository.find({
        where: { isActive: false },
      });

      if (otherLayouts.length > 0) {
        // Set the first other layout as active
        otherLayouts[0].isActive = true;
        await this.layoutRepository.save(otherLayouts[0]);
      }
    }

    await this.layoutRepository.remove(layout);
  }
}

export default new GymLayoutService();
