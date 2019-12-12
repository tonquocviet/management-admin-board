const listRole = [
  {
    id: 1,
    name: 'System Admin',
    description: 'Là quản trị viên của hệ thống',
  },
  {
    id: 2,
    name: 'Nhân viên',
    description: 'Là nhân viên của công ty',
  },
  {
    id: 3,
    name: 'Thực tập sinh',
    description: 'Là thực tập sinh của công ty',
  },
];

function getRoleList(req, res) {
  return res.json(listRole);
}

export default {
  'GET /api/account-management/role': getRoleList,
};
