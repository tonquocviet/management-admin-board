import { parse } from 'url';

const listData = [
  {
    id: '1',
    username: 'user1',
    full_name: 'Tôn Quốc Việt',
    sex_type: true,
    email: 'asdnadr@gmail.com',
    role: 1,
    status_account: true,
  },
  {
    id: '2',
    username: 'user2',
    full_name: 'Phan Quyền Vương',
    sex_type: false,
    email: 'nv06@gmail.com',
    role: 3,
    status_account: true,
  },
  {
    id: '3',
    username: 'user3',
    full_name: 'Phạm Xuân Duy',
    sex_type: false,
    email: 'congtridnh097@gmail.com',
    role: 3,
    status_account: false,
  },
  {
    id: '4',
    username: 'user4',
    full_name: 'Trần Công Trình',
    sex_type: true,
    email: 'congtridnh097@gmail.com',
    role: 2,
    status_account: true,
  },
  {
    id: '5',
    username: 'user5',
    full_name: 'Nguyễn Thị Lan',
    sex_type: true,
    email: 'nv06@gmail.com',
    role: 2,
    status_account: false,
  },
  {
    id: '6',
    username: 'user5',
    full_name: 'Nguyễn Anh Khoa',
    sex_type: true,
    email: 'nv06@gmail.com',
    role: 2,
    status_account: false,
  },
  {
    id: '7',
    username: 'user5',
    full_name: 'Nguyễn Văn Phong',
    sex_type: true,
    email: 'nv06@gmail.com',
    role: 2,
    status_account: false,
  },
  {
    id: '8',
    username: 'user5',
    full_name: 'Dương Thanh Hợp',
    sex_type: true,
    email: 'nv06@gmail.com',
    role: 2,
    status_account: false,
  },
];
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
]
function getList(req, res, u) {
  let url = u;

  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    // eslint-disable-next-line prefer-destructuring
    url = req.url;
  }

  const params = parse(url, true).query;
  let dataSource = listData;

  if (params.sorter) {
    const s = params.sorter.split('_');
    dataSource = dataSource.sort((prev, next) => {
      if (s[1] === 'descend') {
        return next[s[0]] - prev[s[0]];
      }

      return prev[s[0]] - next[s[0]];
    });
  }

  let pageSize = 10;
  const current = parseInt(`${params.currentPage}`, 10) || 1;
  if (params.pageSize) {
    pageSize = parseInt(`${params.pageSize}`, 0);
  }

  const result = {
    list: dataSource.slice(pageSize * (current - 1), pageSize * current),
    pagination: {
      total: dataSource.length,
      pageSize,
      current,
    },
  };
  return res.json(result);
}


function getRoleList(req, res) {
  return res.json(listRole);
}

export default {
  'GET /api/account-management': getList,
  'GET /api/account-management/role': getRoleList,
};
