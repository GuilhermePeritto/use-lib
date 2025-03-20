import { convertModelToType, convertTypeToModel } from "@/lib/utils";
import ModuleModel, { IModule } from "@/models/Module";
import { Module } from "@/types/module";

export const createModule = async (moduleData: Module): Promise<Module> => {
  const moduleModelData = convertTypeToModel<Module, IModule>(moduleData);
  const module = new ModuleModel(moduleModelData);
  const savedModule = await module.save();
  return convertModelToType<IModule, Module>(savedModule);
};

export const getModules = async (): Promise<Module[]> => {
  const modules = await ModuleModel.find();
  return modules.map(convertModelToType<IModule, Module>);
};

export const getModuleById = async (id: string): Promise<Module | null> => {
  const module = await ModuleModel.findById(id);
  return module ? convertModelToType<IModule, Module>(module) : null;
};

export const updateModule = async (id: string, moduleData: Partial<Module>): Promise<Module | null> => {
  const moduleModelData = convertTypeToModel<Partial<Module>, IModule>(moduleData);
  const updatedModule = await ModuleModel.findByIdAndUpdate(id, moduleModelData, { new: true });
  return updatedModule ? convertModelToType<IModule, Module>(updatedModule) : null;
};

export const deleteModule = async (id: string): Promise<Module | null> => {
  const deletedModule = await ModuleModel.findByIdAndDelete(id);
  return deletedModule ? convertModelToType<IModule, Module>(deletedModule) : null;
};