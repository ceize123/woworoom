let generalURL = "https://hexschoollivejs.herokuapp.com/api/livejs/v1";
let api_path = "hahaeating";
let productData = [];
let cartData = [];

let recommendList1 = document.querySelector(".recommendList");
let recommendList2 = document.querySelector(".recommendList2");
let productList = document.querySelector(".productList");
let productSelect = document.querySelector("#productSelect");
let shopList = document.querySelector(".shopList");
let amountPrice = document.querySelector(".delete span");
let deleteAll = document.querySelector(".deleteAll");
let orderInfo = document.querySelector(".orderInfo");

let recommendDataRow1 = [
	{
		img: "./img/recommend/recommendImg1.png",
		head: "./img/recommend/recommendHead1.png",
		name: "王六角",
		item: "Jordan雙人床架",
		comment: "CP值很高。"
	},
	{
		img: "./img/recommend/recommendImg2.png",
		head: "./img/recommend/recommendHead2.png",
		name: "Leaf",
		item: "Antony雙人床架",
		comment: "很喜歡～還有送三年保固～"
	},
	{
		img: "./img/recommend/recommendImg3.png",
		head: "./img/recommend/recommendHead3.png",
		name: "美濃鄧子琪",
		item: "Charles系列廚",
		comment: "廚房必備美用品！"
	}
];
let recommendDataRow2 = [
	{
		img: "./img/recommend/recommendImg4.png",
		head: "./img/recommend/recommendHead4.png",
		name: "小杰",
		item: "Louvre雙人床架",
		comment: "非常舒適，有需要會再回購"
	},
	{
		img: "./img/recommend/recommendImg5.png",
		head: "./img/recommend/recommendHead5.png",
		name: "江六角",
		item: "Charles雙人床架",
		comment: "品質不錯～"
	},
	{
		img: "./img/recommend/recommendImg6.png",
		head: "./img/recommend/recommendHead6.png",
		name: "juni讚神",
		item: "Antony床邊桌",
		comment: "讚ㄉ！"
	}
];

//recommend part
function recommendDisplay(row, list) {
	row.forEach((item) => {
		list.innerHTML += `
		<div class="recommendEach">
			<img src=${item.img} alt="">
			<div class="recommendDetail">
				<div class="recommendName">
					<img src=${item.head} alt="">
					<div>
						<p>${item.name}</p>
						<p>${item.item}</p>
					</div>
				</div>
				<p>${item.comment}</p>
			</div>
		</div>
		`;
	});
}
recommendDisplay(recommendDataRow1, recommendList1);
recommendDisplay(recommendDataRow2, recommendList2);

function getProductData() {
	axios.get(`${generalURL}/customer/${api_path}/products`)
		.then(function (response) {
			productData = response.data.products;
			renderProduct(productData);
		});
}

//product part
function renderProduct(data) {
	let str = "";
	data.forEach((item) => {
		str += `
		<div class="productEach">
			<div class="productDetail">
				<div class="productImg">
					<img src=${item.images} alt="">
					<p class="addToCart" data-id="${item.id}">加入購物車</p>
					<p class="newProduct">新品</p>
				</div>
				<p>${item.title}</p>
				<p><s>NT$<span>${item.origin_price}</span></s></p>
				<p>NT$<span>${item.price}</span></p>
			</div>
		</div>
		`;
	});
	productList.innerHTML = str;
}

//select product by category
productSelect.addEventListener("change", function() {
	let selectProduct = [];
	productData.forEach((item) => {
		if (productSelect.value == item.category) {
			selectProduct.push(item);
		} else if (productSelect.value == "全部") {
			selectProduct = productData;
		}
	});
	renderProduct(selectProduct);
});

//Cart data display
function getCartData() {
	axios.get(`${generalURL}/customer/${api_path}/carts`)
		.then(function (response) {
			cartData = response.data;
			renderCart();
		});
}

//cart part
function renderCart() {
	let str = "";
	cartData.carts.forEach((item) => {
		str += `
		<div class="shopEach">
			<div>
				<img src=${item.product.images} alt="">
				<p>${item.product.title}</p>
			</div>
			<p>NT$<span>${item.product.price}</span></p>
			<p>${item.quantity}</p>
			<p>NT$<span>${item.product.price * item.quantity}</span></p>
			<i class="las la-times" data-id="${item.id}"></i>
		</div>
		`;
	});
	shopList.innerHTML = str;
	amountPrice.innerHTML = `NT$${cartData.finalTotal}`;
}

//add to cart
productList.addEventListener("click", function(e) {
	const productID = e.target.getAttribute("data-id");
	let num = 0;
	cartData.carts.forEach((item) => {
		if (productID == item.product.id) {
			num = item.quantity;
		}
	});
	if (e.target.getAttribute("class") == "addToCart"){
		axios.post(`${generalURL}/customer/${api_path}/carts`, {
			"data": {
				"productId": `${productID}`,
				"quantity": num+1
			}
		})
			.then(function () {
				getCartData();

			});
	}
});

//delete a item
shopList.addEventListener("click", function(e) {
	let cartID = e.target.getAttribute("data-id");
	console.log(cartID);
	axios.delete(`${generalURL}/customer/${api_path}/carts/${cartID}`)
		.then(function () {
			getCartData();
		});
});

//delete all items
deleteAll.addEventListener("click", function() {
	axios.delete(`${generalURL}/customer/${api_path}/carts`)
		.then(function () {
			getCartData();
		});
});

//order
orderInfo.addEventListener("click", function(e) {
	let name = document.querySelector("#name");
	let tel = document.querySelector("#tel");
	let email = document.querySelector("#email");
	let address = document.querySelector("#address");
	let tradeMethod = document.querySelector("#tradeMethod");

	if (e.target.value == "送出預訂資料") {
		if ( name.value == "" && tel.value == "" &&
			email.value == "" && address.value == "") {
			alert("資訊不得為空");
			return;
		} else {
			axios.post(`${generalURL}/customer/${api_path}/orders`, {
				"data": {
					"user": {
						"name": name.value,
						"tel": tel.value,
						"email": email.value,
						"address": address.value,
						"payment": tradeMethod.value
					}
				}
			})
				.then(function () {
					getCartData();
					alert("訂單預定成功！");
					name.value = "";
					tel.value = "";
					email.value = "";
					address.value = "";
				});
		}
	}
});

function init() {
	getProductData();
	getCartData();
}

init();
