let generalURL = "https://hexschoollivejs.herokuapp.com/api/livejs/v1";
let api_path = "hahaeating";
const config = {
	headers: {
		Authorization: "ziorRmqHIzVkl06Sl93DJIagVHq2"
	}
};

let orderData = [];
let productName = {};
let c3Data = [];
let orderInfo = document.querySelector(".orderInfo > table");
let deleteAll = document.querySelector(".orderInfo > button");

//order data render
function getOrderData() {
	axios.get(`${generalURL}/admin/${api_path}/orders`, config)
		.then(function (response) {
			orderData = response.data.orders;
			renderOrder();
			createProductData();
			creatC3Data();
			renderC3();
		});
}

//Order display
function renderOrder() {
	let str = "";
	let productStr = "";
	orderData.forEach((item) => {
		let timeInMs = new Date(item.createdAt * 1000);
		let Y = timeInMs.getFullYear() + "/";
		let M = (timeInMs.getMonth()+1 < 10 ? "0"+(timeInMs.getMonth()+1) : timeInMs.getMonth()+1) + "/";
		let D = timeInMs.getDate();
		item.products.forEach((item) => {
			productStr += `<p>${item.title}x${item.quantity}</p>`;
		});

		str += `
		<tr class="${item.id}">
			<td>${item.createdAt}</td>
			<td>${item.user.name}<span>${item.user.tel}</span></td>
			<td>${item.user.address}</td>
			<td>${item.user.email}</td>
			<td>${productStr}</td>
			<td>${Y+M+D}</td>
			<td><a class="status" data-status="${item.paid}" data-id="${item.id}">${item.paid ? "已處理" : "未處理" }</a></td>
			<td><p class="delete" data-id="${item.id}">刪除</p></td>
		</tr>
		`;
	});
	orderInfo.innerHTML = `
	<tr>
		<th>訂單編號</th>
		<th>聯絡人</th>
		<th>聯絡地址</th>
		<th>電子郵件</th>
		<th>訂單品項</th>
		<th>訂單日期</th>
		<th>訂單狀態</th>
		<th>操作</th>
	</tr>` + str;
}

// change status + delete order
orderInfo.addEventListener("click", function(e) {
	e.preventDefault();
	const targetClass = e.target.getAttribute("class");

	if (targetClass == "delete") {
		let id = e.target.getAttribute("data-id");
		deleteOrder(id);
		return;
	}

	if (targetClass == "status") {
		let status = e.target.getAttribute("data-status");
		let id = e.target.getAttribute("data-id");
		changeStatus(status, id)
		return;
	}
});

function changeStatus(status, id) {
	let newStatus;
	status == "true" ? newStatus = false : newStatus = true;
	axios.put(`${generalURL}/admin/${api_path}/orders`,
		{
			"data": {
				"id": id,
				"paid": newStatus
			}}, config)
		.then(function () {
			alert("已更改訂單狀態");
			getOrderData();
		});
}

//delete an order
function deleteOrder(id) {
	axios.delete(`${generalURL}/admin/${api_path}/orders/${id}`, config)
		.then(function () {
			alert("已刪除一筆訂單");
			getOrderData();
		});
}

//delete all orders
deleteAll.addEventListener("click", function() {
	axios.delete(`${generalURL}/admin/${api_path}/orders`, config)
		.then(function () {
			alert("已刪除全部訂單");
			getOrderData();
		});
});


//C3
function createProductData() {
	productName = {};
	orderData.forEach((item) => {
		item.products.forEach((item) => {
			if (productName[item.title] == undefined) {
				productName[item.title] = item.quantity * item.price;
			} else {
				productName[item.title] += item.quantity * item.price;
			}
		});
	});
}

function creatC3Data() {
	c3Data = [];
	let product = Object.keys(productName);
	let j;
	let str = "";
	let num;

	//sort products
	product.forEach((item, index) => {
		num = productName[item];
		for (let i = index; i < product.length; i++) {
			if (num < productName[product[i]]) {
				num = productName[product[i]];
				str = item;
				j = i;
			}
		}
		if (productName[item] < num) {
			product[index] = product[j];
			product[j] = str;
		}
	});

	// product.sort(function (a, b) {
	// 	return b[1] - a[1];
	// });

	if (product.length >= 4) {
		let others = 0;
		for (let i = 3; i < product.length; i++) {
			others += productName[product[i]];
			delete productName[product[i]];
		}
		product.splice(3);
		product.push("其他");
		productName["其他"] = others;
	}

	product.forEach((item) => {
		let aryC3 = [];
		aryC3.push(item);
		aryC3.push(productName[item]);
		c3Data.push(aryC3);
	});
}

function renderC3() {
	const chart = c3.generate({
		bindo: "#chart",
		data: {
			columns: c3Data,
			type: "pie",
		},
		size: {
			width: 1100,
			height: 350
		},
		color: {
			pattern: ["#DACBFF", "#9D7FEA", "#5434A7", "#301E5F"]
		}
	});
}

function init() {
	getOrderData();
}

init();
