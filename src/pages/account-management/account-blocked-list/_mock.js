const listRole = [
  {
    id: 1,
    name: 'System Admin',
    description: 'Là quản trị viên của hệ thống',
  },
  {
    id: 2,
    name: 'Quản lý',
    description: 'Là quản lý cao nhất của công ty',
  },
  {
    id: 3,
    name: 'Kế toán',
    description: 'Là nhân viên kế toán của công ty',
  },
];

function getRoleList(req, res) {
  return res.json(listRole);
}

export default {
  'GET /api/account-management/role': getRoleList,
};
