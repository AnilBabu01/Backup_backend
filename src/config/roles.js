const roles = ['ADMIN', 'RO_MANAGER'];

const roleRights = new Map();
roleRights.set(roles[0], ['manageRoles', 'getUsers', 'createUser','PortalManageMent','SmtpUser']);

roleRights.set(roles[1], ['SmtpUser']);

roleRights.set(roles[2], ['SmtpUser']);

roleRights.set(roles[3], []);

module.exports = {
  roles,
  roleRights,
};
