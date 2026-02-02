import { useEffect, useState } from 'react';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Tooltip, Spin, Button, Table } from 'antd';
import type { IFood } from "../features/foods/foodsSlice";
import { setPage, setPageSize } from '../features/foods/foodsSlice';
import { useDispatch, useSelector } from 'react-redux';
import { deleteFood, fetchFoods, type IFoodsStore } from '../features/foods/foodsSlice';
import FoodModal from '../Components/FoodModal';
import DeleteModal from '../Components/DeleteModal';
import './Foods.css'
import type { ColumnsType } from 'antd/es/table';



const Foods = () => {
    const { foodsListData }: { foodsListData: IFoodsStore["foodsListData"] } = useSelector((state: any) => state.foods);
    console.log("foodlist", foodsListData);
    const dispatch = useDispatch();

    const Image_Url = 'https://bssrms.runasp.net/images/food/';

    const { page, pageSize, total, foods, isLoading } = foodsListData;

    const [foodModalOpen, setFoodModalOpen] = useState(false);
    const [editingFood, setEditingFood] = useState<IFood | null>(null);

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedFoodId, setSelectedFoodId] = useState<number | null>(null);


    useEffect(() => {
        dispatch(fetchFoods({ page, pageSize }) as any);
    }, [page, pageSize, dispatch]);

    const handleEditClick = (food: IFood) => {
        setEditingFood(food);
        setFoodModalOpen(true);
    };

    const handleAddClick = () => {
        setEditingFood(null);
        setFoodModalOpen(true);
    };

    const handleDeleteClick = (id: number) => {
        setSelectedFoodId(id);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedFoodId) return;

        dispatch(deleteFood(selectedFoodId) as any);
        setDeleteModalOpen(false);
    };

    const onPaginationChange = (currentPage: number, size: number) => {
        dispatch(setPage(currentPage));
        if (size !== pageSize) {
            dispatch(setPageSize(size));
        }
    }

    const columns: ColumnsType<IFood> = [
        {
           
            dataIndex: 'image',
            key: 'image',
            width: 120,
            minWidth: 120,
            render: (imageName) => <img src={imageName ? `${Image_Url}${imageName}` : 'https://placehold.co/50'} alt="food" className="table-food-img" />,
            
        },
        {
            title: () => <Tooltip title="Food Name"><span>Name</span></Tooltip>,
            dataIndex: 'name',
            key: 'name',
            width: 'auto',
            render: (text) => <span className="text-gray-700">{text}</span>,
        },
        {
            title: () => <Tooltip title="Price"><span>Price</span></Tooltip>,
            dataIndex: 'price',
            key: 'price',
            width: 'auto',
        },
        {
            title: () => <Tooltip title="Discount Type"><span>Discount Type</span></Tooltip>,
            dataIndex: 'discountType',
            key: 'discountType',
            width: 'auto',
        },
        {
            title: () => <Tooltip title="Discount Value"><span>Discount</span></Tooltip>,
            dataIndex: 'discount',
            key: 'discount',
            width: 'auto',
        },
        {
            title: () => <Tooltip title="Final Price"><span>Discounted Price</span></Tooltip>,
            dataIndex: 'discountPrice',
            key: 'discountPrice',
            width: 'auto',
        },
        {
            title: () => (
                <Tooltip title="Add New Food Item">
                    <Button
                        icon={<PlusOutlined />}
                        onClick={handleAddClick}
                        className="add-food-btn"
                    >
                        Add Food Item
                    </Button>
                </Tooltip>
            ),
            key: 'actions',
            width: 180,
            minWidth: 180,
            align: 'center',
            render: (_, record) => (
                <div className="action-btn-container">
                    <Tooltip title="Edit Food">
                        <button onClick={() => handleEditClick(record)} className="action-btn">
                            <EditOutlined />
                        </button>
                    </Tooltip>
                    <Tooltip title="Delete Food">
                        <button onClick={() => handleDeleteClick(record.id)} className="action-btn">
                            <DeleteOutlined />
                        </button>
                    </Tooltip>
                </div>
            ),
        },
    ];

    return (
        <div className="foods-container">
            <div className="table-wrapper">
                <Table
                    columns={columns}
                    dataSource={foods}
                    rowKey="id"
                    loading={{ spinning: isLoading, indicator: <Spin size="large" /> }}
                    pagination={{
                        current: page,
                        pageSize: pageSize,
                        total: total,
                        position: ['bottomCenter'],
                        onChange: onPaginationChange,
                        showSizeChanger: true, 
                        pageSizeOptions: ['10', '20', '30', '40', '50'], 
                        showTotal: (total, range) => (
                            <span className="pagination-total-text">
                                {range[0]}-{range[1]} of {total} items
                            </span>
                        ),
                        className: "custom-ant-pagination",                        
                    }}
                    scroll={{ y: 380 }}
                    rowClassName={() => 'custom-table-row'}
                />
            </div>

            <FoodModal
                isOpen={foodModalOpen}
                initialData={editingFood}
                onClose={() => setFoodModalOpen(false)}
                onSuccess={() => fetchFoods({ page, pageSize })}
            />
            <DeleteModal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} onConfirm={handleConfirmDelete} title="food item" />
        </div>
    );


};

export default Foods;

