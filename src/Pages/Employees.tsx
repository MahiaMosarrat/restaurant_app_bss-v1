import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { ColumnsType } from 'antd/es/table';
import {
  UserAddOutlined,
  EditOutlined,
  DeleteOutlined,
  StarFilled
} from '@ant-design/icons';
import { Tooltip, Spin, Button, Table } from 'antd';

import {
  fetchEmployees,
  deleteEmployee,
  setPage,
  setPageSize
} from '../features/employees/employeesSlice';
import type { IEmployee } from '../features/employees/employeesSlice';
import EmployeeModal from '../Components/EmployeeModal';
import DeleteModal from '../Components/DeleteModal';
import './Employee.css';

const Employees: React.FC = () => {
  const dispatch = useDispatch();
  const [scrollX, setScrollX] = useState<string | number>('100%');

  const { page, pageSize, total, employees, isLoading } = useSelector((state: any) => state.employees.employeeListData);

  const [employeeModalOpen, setEmployeeModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<IEmployee | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 825) {
        setScrollX('max-content');
      } 
      else {    
        setScrollX('100%');
      }
    };

   
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    dispatch(fetchEmployees({ page, pageSize }) as any);
  }, [page, pageSize, dispatch]);

  const onPaginationChange = (currentPage: number, size: number) => {
    dispatch(setPage(currentPage));
    if (size !== pageSize) {
      dispatch(setPageSize(size));
    }
  };

  const handleEditClick = (employee: IEmployee) => {
    setEditingEmployee(employee);
    setEmployeeModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setSelectedEmployeeId(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedEmployeeId) return;
    dispatch(deleteEmployee(selectedEmployeeId) as any);
    setDeleteModalOpen(false);
  };

  const columns: ColumnsType<IEmployee> = [
    {
      title: '',
      key: 'avatar',
      width: 120,
      fixed: 'left',
      className: 'column-avatar',
      render: (_, record) => {
        const avatarUrl = record.user?.image
          ? `https://bssrms.runasp.net/images/user/${record.user.image}`
          : `https://ui-avatars.com/api/?name=${record.user?.firstName}&background=random`;

        return (
          <img
            src={avatarUrl}
            className="table-employee-img"
            alt="avatar"
          />
        );
      },
    },
    {
      title: () => <Tooltip title="Employee Full Name"><span>Name</span></Tooltip>,
      key: 'name',
      fixed: 'left',
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-700">
            {record.user?.firstName} {record.user?.lastName}
          </span>
          <StarFilled className="employee-name-star" />
        </div>
      ),
    },
    {
      title: () => <Tooltip title="Contact Email"><span>Email</span></Tooltip>,
      render: (_, record) => <span>{record.user?.email}</span>,
      width: 'auto',
      fixed: 'left',
    },
    {
      title: () => <Tooltip title="Job Title"><span>Designation</span></Tooltip>,
      dataIndex: 'designation',
      width: 'auto',
      fixed: 'left',
    },
    {
      title: () => <Tooltip title="Date Joined"><span>Join Date</span></Tooltip>,
      dataIndex: 'joinDate',
      key: 'joinDate',
      render: (date) => date?.split('T')[0],
      width: 'auto',
      fixed: 'left',
    },
    {
      title: () => <Tooltip title="Phone Number"><span>Phone</span></Tooltip>,
      render: (_, record) => <span>{record.user?.phoneNumber}</span>,
      width: 'auto',
      fixed: 'left',
    },
    {
      title: () => (
        <Tooltip title="New Employee">
          <Button
            icon={<UserAddOutlined />}
            onClick={() => { setEditingEmployee(null); setEmployeeModalOpen(true); }}
            className="add-employee-btn"
          >
            Add Employee
          </Button>
        </Tooltip>
      ),
      key: 'actions',
      className: 'column-actions',
      width: 180,
      minWidth: 180,
      fixed:'right',
      align: 'right',
      render: (_, record) => (
        <div className="employee-action-container">
          <Tooltip title="Edit Details">
            <button onClick={() => handleEditClick(record)} className="employee-action-btn">
              <EditOutlined />
            </button>
          </Tooltip>
          <Tooltip title="Delete">
            <button onClick={() => handleDeleteClick(record.id)} className="employee-action-btn">
              <DeleteOutlined />
            </button>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div className="employees-page-container">
      <div className="employee-table-wrapper">
        <Table
          columns={columns}
          dataSource={employees}
          rowKey="id"
          loading={{ spinning: isLoading, indicator: <Spin size="large" /> }}
          pagination={{
            current: page,
            pageSize: pageSize,
            total: total,
            onChange: onPaginationChange,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '30', '40', '50'],
            showTotal: (total, range) => (
              <span className="employee-pagination-total">
                {range[0]}-{range[1]} of {total} items
              </span>
            ),
            className: "employee-ant-pagination",
            position: ['bottomCenter'],
          }}
          scroll={{ x: scrollX, y: 380 }}
          rowClassName={() => 'employee-table-row'}
        />
      </div>

      <EmployeeModal
        isOpen={employeeModalOpen}
        initialData={editingEmployee}
        onClose={() => setEmployeeModalOpen(false)}
        onSuccess={() => dispatch(fetchEmployees({ page, pageSize }) as any)}
      />

      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="employee"
      />
    </div>
  );
};

export default Employees;