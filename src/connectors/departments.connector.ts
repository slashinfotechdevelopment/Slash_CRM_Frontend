import { rolesConnector } from './roles.connector';

export const departmentsConnector = {
  getDepartments: rolesConnector.getDepartments.bind(rolesConnector),
  getDepartment: rolesConnector.getDepartment.bind(rolesConnector),
  createDepartment: rolesConnector.createDepartment.bind(rolesConnector),
  updateDepartment: rolesConnector.updateDepartment.bind(rolesConnector),
  deleteDepartment: rolesConnector.deleteDepartment.bind(rolesConnector),
};
