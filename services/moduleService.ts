import ModuleModel, { IModule } from "@/models/Module";

export const createModule = async (moduleData: IModule): Promise<IModule> => {
  const module = new ModuleModel(moduleData);
  const savedModule = await module.save();
  return savedModule
};

export const getModules = async (): Promise<IModule[]> => {
  const modules = await ModuleModel.find();
  return modules
};

export const getModuleById = async (id: string): Promise<IModule | null> => {
  const module = await ModuleModel.findById(id);
  return module
};

export const updateModule = async (id: string, moduleData: Partial<IModule>): Promise<IModule | null> => {
  const updatedModule = await ModuleModel.findByIdAndUpdate(id, moduleData, { new: true });
  return updatedModule
};

export const deleteModule = async (id: string): Promise<IModule | null> => {
  const deletedModule = await ModuleModel.findByIdAndDelete(id);
  return deletedModule
};