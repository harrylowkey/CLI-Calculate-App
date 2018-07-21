let fs = require('fs');
let readlineSync = require('readline-sync')
let {table} = require('table')
let goods = {};


function loadData(){
	let data = fs.readFileSync(('Hanghoa.json'), { encoding: 'utf8'});
	goods = JSON.parse(data);
}


let tableHead = ['Name', 'Price (VND)'];
function showAllGoods(){
	let config,output;
	let listTable = [];
	let list = [];
	list = Object.values(goods);
	for (let item of list){
		for (let i = 0; i < item.length; i++){
			listTable.push(Object.values(item[i]));
		}
	}
	listTable.unshift(tableHead);

	config = {
    columns: {
        1: {
            alignment: 'right',
            minWidth: 10
        },
    }
};

output = table(listTable, config);
	console.log(output);
	console.log('            ');
}

function checkItemPrice(){
	let check = 0;
	let typeCheck = readlineSync.question('Which type of item do you want to check?\n> ');
	let typeCheckTable = [];
	let output, config;

	for (let i in goods[typeCheck]){
			typeCheckTable.push(Object.values(goods[typeCheck][i]));
	}
	typeCheckTable.unshift(tableHead);
	config = {
    columns: {
        1: {
            alignment: 'right',
            minWidth: 10
        },
    }
	};
	output = table(typeCheckTable,config);
	console.log(output);
	console.log('            ');

	if (!goods[typeCheck]){
		console.log('We don\'t have ' + typeCheck + ' type in the store!');
		if (readlineSync.keyInYN("Do you want to check another grocery? ")) checkItemPrice(goods);
			console.log('      ');
	}

	else{
		for(let i in goods){
			if (i === typeCheck){
				check = 1;
				break;
			}
		}
		if (check === 0){
			console.log('We don\'t have ' + typeCheck + ' type in the store!')
			if (readlineSync.keyInYN("Do you want to check another grocery? ")) checkItemPrice(goods);
				console.log('      ');
		}
		else{
			check = 0;
			let itemCheck = readlineSync.question("Which item do you want to check?\n> ");
			let itemPrice = goods[typeCheck].find(function(item){
				if (item.name === itemCheck){
					check = 1;
					return item;
				}
			})
			if (check === 0) {
				console.log('We don\'t have ' + itemCheck + ' in store');
				if (readlineSync.keyInYN("Do you want to check another item? ")) checkItemPrice(goods);
				console.log('        ');
			}
			else {
				let itemCheckTable = [];
				let config, output;

				itemCheckTable.push(Object.values(itemPrice));
				itemCheckTable.unshift(tableHead);

				config = {
			    columns: {
			        1: {
			            alignment: 'right',
			            minWidth: 10
			        },
			    }
				};
				output = table(itemCheckTable,config);
				console.log(output);

				if (readlineSync.keyInYN("Do you want to check another item? ")) checkItemPrice(goods);
				console.log('      ');
			}
		}
	}

}


let receipt = [];
function countPrice(){
	let check = 0;
	let typeCheck = readlineSync.question('What is your type of item?\n> ');
	for(let i in goods){
		if (i === typeCheck){
			check = 1;
			break;
		}
	}
	if (check === 0){
		console.log('We don\'t have ' + typeCheck + ' type in the store!\n')
		console.log('Please say exactly name of your type')
		countPrice(goods);
	}
	else{
		check = 0;
		let itemCheck = readlineSync.question("What is your item?\n> ");
		let itemPrice = goods[typeCheck].find(function(item){
			if (item.name === itemCheck){
				check = 1;
				return item;
			}
		})
		if (check === 0) {
			console.log('We don\'t have ' + itemCheck + ' in store');
			console.log('Please say exactly name of the item');
			countPrice(goods);
		}
		else {
			let quantity = parseInt(readlineSync.question('Item\'s quantity: '));

			let temporaryReceipt = {};
			let goodsOfCustomer = goods[typeCheck].find(item => item.name === itemCheck);
			temporaryReceipt.name = goodsOfCustomer.name;
			temporaryReceipt.quantity = quantity;
			temporaryReceipt.price = goodsOfCustomer.price;
			receipt.push(temporaryReceipt);

				if (readlineSync.keyInYN("Any items? ")){
					 countPrice(goods);
				}
				else {
					let lastReceipt = receipt.reduce((total, item) => total + item.price * item.quantity, 0);
					let itemsTable = [];
					let countPriceTableHead = ["Name", "Quantity", "Price"];
					let config, output;

					console.log('Here is your receipt: \n');
					for (let content of receipt){
						itemsTable.push(Object.values(content))
					}
					itemsTable.unshift(countPriceTableHead);
					console.log(table(itemsTable));

					let receiptTable = [
														['You have to pay' ],
														[ lastReceipt + ' VND']
													];
					config = {
				    columns: {
				        1: {
				            alignment: 'right',
				            minWidth: 10
				        },
				    }
					};
					output = table(receiptTable, config);
					console.log(output);
					let customerMoney = readlineSync.question('Your money is: ');
					console.log(' ');

					let bill = customerMoney - lastReceipt;
					let billTable = [];
					if (bill < 0 ) {
						billTable = [
											[ 'You\'re missing', 'VND'],
											[ 'Thank you!!! & See you again!!!', Math.abs(bill)]
										];

					output = table(billTable, config);
					console.log(output);
					}
					else if (bill > 0){
						billTable = [
											[ 'Here is your excess cash:', 'VND'],
											[ 'Thank you!!! & See you again!!!', bill]
										];
					output = table(billTable, config);
					console.log(output);
					}
					else{
						billTable = [
											[ 'You paid enouhgt', ' :D ' ],
											['Thank you!!!', 'See you again!!!']
										];

						console.log(table(billTable));
					}

				console.log('\n');

				}
			}

		}
	}

function addType(){
	let typeAdd = readlineSync.question('What is the type of item? ');
	let infoItem = [];
	if (!goods[typeAdd]) goods[typeAdd] = [];
	function addItem(){
		let check = false;
			let itemNameAdd = readlineSync.question('What is the name of item? ');
			for (let content of goods[typeAdd]){
				if (content.name === itemNameAdd){
					check = true;
					break;
				}
			}
			if (check){
				console.log('This item have been already in our store');
				if (readlineSync.keyInYN("Do you want to add another item? ")){
					addItem();
				}
				else{
					if (readlineSync.keyInYN("Do you want to add more type? ")){
						addType()();
					}
				}
			}

			else{
				let itemPriceAdd = parseInt(readlineSync.question('What is the price of item? '));
				let itemAddObject = {};

				itemAddObject.name = itemNameAdd;
				itemAddObject.price = itemPriceAdd;
				infoItem.push(itemAddObject);
				console.log(infoItem);
				if (readlineSync.keyInYN("Do you want to add another items? ")){
					addItem();
				}
				else{
					// console.log('first check')
					if (readlineSync.keyInYN("Do you want to add more type? ")){
						addType()();
					}
					// console.log('flag');
					console.log(infoItem);
					for (let content of infoItem){
						goods[typeAdd].push(content);
					}
					let convert = JSON.stringify(goods);
					fs.writeFileSync('./Hanghoa.json', convert);
					console.log(itemNameAdd + ' has been added!');
				}
				// console.log('oh yeah')
			}
			// console.log('fuck yeah')
		}
	return addItem;
}



function showMenu(){
	let choice;
	console.log('Menu options:');
	let menuTable = [
									[1, 'Show groceries'],
									[2, 'Check item price'],
									[3, 'Count your groceries\'s price'],
									[4, 'Add item'],
									[5, 'Exit']
								]
	console.log(table(menuTable));
	choice = readlineSync.question('> ');
	switch(choice){
		case '1':
			showAllGoods();
			showMenu();
			break;
		case '2':
			checkItemPrice();
			showMenu();
			break;
		case '3':
			countPrice();
			receipt = [];
			showMenu();
			break;
		case '4':
			addType()();
			break;
		default:
			console.log('Exited');
			break;
	}
}

function main(){
	loadData();
	showMenu();
}

main();

