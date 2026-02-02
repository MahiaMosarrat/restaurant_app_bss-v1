
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { deleteOrder, fetchOrders, updateOrderStatus } from '../features/orders/ordersSlice'; 
import { SyncOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Dropdown, Modal, message } from 'antd';
import EditOrderModal from './EditOrderModal';

const OrderCard = ({ order }: { order: any }) => {
    const dispatch = useDispatch();
    const [editModalOpen, setEditModalOpen] = useState(false);
    const FOOD_IMAGE_URL = 'https://bssrms.runasp.net/images/food/';

    const getStatusStyle = (status: string): React.CSSProperties => {
        switch (status) {
            case 'Paid': return { color: '#28a745', fontWeight: 'bold' }; 
            case 'Pending': return { color: '#fd7e14', fontWeight: 'bold' }; 
            case 'PreparedToServe': 
            case 'P.T.S': return { color: '#17a2b8', fontWeight: 'bold' }; 
            default: return { color: '#6c757d', fontWeight: 'bold' };
        }
    };

    const handleStatusChange = async (newStatus: string) => {
        try {
            await dispatch(updateOrderStatus({ id: order.id, status: newStatus }) as any).unwrap();
            message.success(`Status updated to ${newStatus}`);

            dispatch(fetchOrders({ page: 1, perPage: 10 }) as any);
        } catch (err) {
            message.error("Status update failed");
        }
    };

    const statusMenuProps = {
        items: [
            { key: 'Pending', label: 'Pending' },
            { key: 'Confirmed', label: 'Confirmed' },
            { key: 'Preparing', label: 'Preparing' },
            { key: 'PreparedToServe', label: 'Prepared To Serve' },
            { key: 'Served', label: 'Served' },
            { key: 'Paid', label: 'Paid' },
            { label: 'Cancelled', key: 'Cancelled' },
        ],
        onClick: ({ key }: { key: string }) => handleStatusChange(key),
    };

    return (
        <div className="order-card-container bg-white rounded-lg shadow-sm border-0 h-100">
            <div className="d-flex justify-content-between p-4 pb-2">
                <div>
                    <div className="text-xl fw-bold">{order.orderNumber}</div>
                    <div className="text-muted small">
                        {new Date(order.orderTime).toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true, month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                </div>
                <div className="d-flex gap-2">
                    <Dropdown menu={statusMenuProps} trigger={['hover']}>
                        <Button size="small" type="text" icon={<SyncOutlined />} />
                    </Dropdown>
                    <Button size="small" type="text" icon={<EditOutlined />} onClick={() => setEditModalOpen(true)} />
                    <Button 
                        size="small" type="text" danger 
                        icon={<DeleteOutlined />} 
                        onClick={() => {
                            Modal.confirm({
                                title: `Delete Order ${order.orderNumber}?`,
                                onOk: () => dispatch(deleteOrder(order.id) as any)
                            });
                        }} 
                    />
                </div>
            </div>
            
            <hr className="m-0 opacity-50" />

            <div className="order-card-body p-4 pt-0">
                {order.orderItems?.map((item: any) => (
                    <div key={item.id} className="d-flex justify-content-between align-items-center mt-4">
                        <div className="d-flex gap-3 align-items-center">
                            <img 
                                src={item.food.image ? `${FOOD_IMAGE_URL}${item.food.image}` : 'https://placehold.co/60x50'} 
                                style={{ width: '60px', height: '50px', objectFit: 'cover', borderRadius: '8px' }}
                                alt={item.food.name} 
                            />
                            <div>
                                <div className="fw-bold">{item.food.name || "Food Item Missing"}</div>
                                <div className="text-muted small">{item.unitPrice} ৳</div>
                            </div>
                        </div>
                        <div className="text-muted small fw-bold">QTY. {item.quantity}</div>
                    </div>
                ))}
            </div>

            <div className="p-3 px-4 bg-white rounded-bottom mt-auto border-top">
                <div className="d-flex justify-content-between align-items-end">
                    <div>
                        <div className="small text-muted">Total Quantity: <b>{order.orderItems?.reduce((sum: number, i: any) => sum + i.quantity, 0)}</b></div>
                        <div className="h5 mb-0 fw-bold">
                            Total Amount (৳): <span className="text-primary underline">{order.amount}৳</span>
                        </div>
                    </div>
                    <div className="text-end">
                        <div className="small" style={getStatusStyle(order.orderStatus)}>{order.orderStatus}</div>
                        <div className="h4 mb-0 fw-bold text-secondary">
                            {order.table?.tableNumber || "N/A"}
                        </div>
                    </div>
                </div>
            </div>

            <EditOrderModal 
                isOpen={editModalOpen} 
                order={order} 
                onClose={() => setEditModalOpen(false)} 
            />
        </div>
    );
};

export default OrderCard;