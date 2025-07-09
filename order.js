const yourOrder = JSON.parse(localStorage.getItem('orderItem')) || [];

console.log("iam orderItem", yourOrder);

const orderContainer = document.querySelector(".order-container");

let total = 0;

const orderTable = document.createElement("table");
orderTable.border = "1";
orderTable.cellPadding = "8";
orderTable.cellSpacing = "0";
orderTable.style.width = "100%";
orderTable.style.textAlign = "left";

orderTable.innerHTML = `
    <thead>
        <tr>
            <th>Item</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Subtotal</th>
        </tr>
    </thead>
    <tbody>
        ${yourOrder.map(item => {
            const subtotal = item.actualPrice * item.quantity;
            total += subtotal;
            return `
                <tr>
                    <td>${item.title}</td>
                    <td>${item.quantity}</td>
                    <td>₹${item.actualPrice}</td>
                    <td>₹${subtotal}</td>
                </tr>
            `;
        }).join('')}
        <tr>
            <td colspan="3" style="text-align:right;"><strong>Total</strong></td>
            <td><strong>₹${total}</strong></td>
        </tr>
    </tbody>
`;

orderContainer.appendChild(orderTable);