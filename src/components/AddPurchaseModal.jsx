import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';

const AddPurchaseModal = ({ isOpen, onClose, onSave, students, shopItems }) => {
  const [newPurchase, setNewPurchase] = useState({
    studentId: '',
    studentName: '',
    items: [],
    totalAmount: 0,
    paymentMethod: 'cash'
  });

  const addItemToPurchase = (item) => {
    const existingItem = newPurchase.items.find(i => i.id === item.id);
    
    if (existingItem) {
      setNewPurchase({
        ...newPurchase,
        items: newPurchase.items.map(i =>
          i.id === item.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        ),
        totalAmount: newPurchase.totalAmount + item.price
      });
    } else {
      setNewPurchase({
        ...newPurchase,
        items: [...newPurchase.items, { ...item, quantity: 1 }],
        totalAmount: newPurchase.totalAmount + item.price
      });
    }
  };

  const removeItemFromPurchase = (itemId) => {
    const item = newPurchase.items.find(i => i.id === itemId);
    setNewPurchase({
      ...newPurchase,
      items: newPurchase.items.filter(i => i.id !== itemId),
      totalAmount: newPurchase.totalAmount - (item.price * item.quantity)
    });
  };

  const updateItemQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      removeItemFromPurchase(itemId);
    } else {
      const item = newPurchase.items.find(i => i.id === itemId);
      const quantityDiff = newQuantity - item.quantity;
      
      setNewPurchase({
        ...newPurchase,
        items: newPurchase.items.map(i =>
          i.id === itemId
            ? { ...i, quantity: newQuantity }
            : i
        ),
        totalAmount: newPurchase.totalAmount + (item.price * quantityDiff)
      });
    }
  };

  const selectStudent = (student) => {
    setNewPurchase({
      ...newPurchase,
      studentId: student.id,
      studentName: student.name
    });
  };

  const handleSave = () => {
    if (newPurchase.items.length === 0) {
      alert('Please add at least one item');
      return;
    }

    if (!newPurchase.studentId) {
      alert('Please select a student');
      return;
    }

    onSave(newPurchase);
    setNewPurchase({
      studentId: '',
      studentName: '',
      items: [],
      totalAmount: 0,
      paymentMethod: 'cash'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Add New Purchase</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <FiX size={24} />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Student Selection & Items */}
            <div>
              <h3 className="font-semibold mb-4">Select Student</h3>
              <select
                onChange={(e) => {
                  const student = students.find(s => s.id === e.target.value);
                  if (student) selectStudent(student);
                }}
                className="w-full p-3 border border-gray-200 rounded-lg mb-6"
              >
                <option value="">Choose a student...</option>
                {students.map(student => (
                  <option key={student.id} value={student.id}>
                    {student.name} - {student.studentId} ({student.className})
                  </option>
                ))}
              </select>

              <h3 className="font-semibold mb-4">Available Items</h3>
              <div className="grid grid-cols-1 gap-3 max-h-64 overflow-y-auto pr-2">
                {shopItems.map(item => (
                  <div key={item.id} className="border rounded-lg p-3 flex justify-between items-center">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">₦{item.price.toLocaleString()}</p>
                    </div>
                    <button
                      onClick={() => addItemToPurchase(item)}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                    >
                      Add
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Cart & Payment */}
            <div>
              <h3 className="font-semibold mb-4">Selected Items</h3>
              {newPurchase.items.length > 0 ? (
                <div className="space-y-3 mb-6">
                  {newPurchase.items.map(item => (
                    <div key={item.id} className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">₦{item.price.toLocaleString()} each</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                        >
                          -
                        </button>
                        <span className="font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeItemFromPurchase(item.id)}
                          className="text-red-500 hover:text-red-700 ml-2"
                        >
                          <FiX size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg mb-6">
                  <p className="text-gray-500">No items selected</p>
                </div>
              )}

              <div className="border-t pt-4 mb-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-blue-600">₦{newPurchase.totalAmount.toLocaleString()}</span>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Payment Method</label>
                <select
                  value={newPurchase.paymentMethod}
                  onChange={(e) => setNewPurchase({...newPurchase, paymentMethod: e.target.value})}
                  className="w-full p-3 border border-gray-200 rounded-lg"
                >
                  <option value="cash">Cash</option>
                  <option value="transfer">Bank Transfer</option>
                  <option value="card">Card Payment</option>
                </select>
              </div>

              <button
                onClick={handleSave}
                disabled={!newPurchase.studentId || newPurchase.items.length === 0}
                className={`w-full py-3 rounded-lg font-medium ${
                  newPurchase.studentId && newPurchase.items.length > 0
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Complete Purchase
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPurchaseModal;