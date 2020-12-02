var express = require('express');
var router = express.Router();
var bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({extended:false});
var mysql = require("mysql2");

var conn_info = {
    host : "localhost",
    port : 3306,
    user : "root",
    password : "1234",
    database : "project"
}

var Web3 = require('web3');
var web3 = new Web3('http://localhost:8545');

var contractABI = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_initialAmount",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_tokenName",
				"type": "string"
			},
			{
				"internalType": "uint8",
				"name": "_decimalUnits",
				"type": "uint8"
			},
			{
				"internalType": "string",
				"name": "_tokenSymbol",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "_owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "_spender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_value",
				"type": "uint256"
			}
		],
		"name": "Approval",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "_from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "_to",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_value",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "address",
				"name": "_owner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_spender",
				"type": "address"
			}
		],
		"name": "allowance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "remaining",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "allowed",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "address",
				"name": "_spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_value",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [
			{
				"internalType": "bool",
				"name": "success",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "address",
				"name": "_owner",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_value",
				"type": "uint256"
			}
		],
		"name": "approveMain",
		"outputs": [
			{
				"internalType": "bool",
				"name": "success",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "address",
				"name": "_owner",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "balance",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "balances",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "decimals",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "main",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "setMain",
		"outputs": [
			{
				"internalType": "bool",
				"name": "success",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "totalSupply",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "address",
				"name": "_to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_value",
				"type": "uint256"
			}
		],
		"name": "transfer",
		"outputs": [
			{
				"internalType": "bool",
				"name": "success",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "address",
				"name": "_from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_value",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [
			{
				"internalType": "bool",
				"name": "success",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	}
];

let main = {
	id: "as",
	name: "문화페이",
	account: "0xD770478Aa857c0582c742c6E62f4e5CC2B7EAc11"
}

let tokenContract = new web3.eth.Contract(contractABI, "0xF48D0242Add44e629524D09171F80945d9198257", {
	from: main.account,
	gasPrice: '3000000' 
});

router.get('/', (req, res, next) => {
	res.render('signin');
});

router.post('/login', urlencodedParser, (req, res, next) => {
	var id = req.body.id;
	var pw = req.body.pw;

	req.session.user_id = id;

	var conn = mysql.createConnection(conn_info);
	var sql = "select ID, PW, Name, Account from member where ID = ?"

	conn.query(sql, [id], (err, rows) => {
		req.session.user_name = rows[0].Name;
		req.session.user_account = rows[0].Account;
		
		res.redirect('home');
	});
});

router.get('/log', function(req, res, next) {
	let data = {
		user: {
			id: req.session.user_id,
			name: req.session.user_name,
			account: req.session.user_account,
			balance: null
		},
		rows: null
	};

	var conn = mysql.createConnection(conn_info);
	var sql = "select T_FROM, T_F_NAME, T_TO, T_T_NAME, T_VALUE, T_MEMO, date_format(T_DATE, '%Y-%m-%d') as T_DATE from log where T_FROM = ? or T_TO = ? ORDER BY `idx` DESC LIMIT 100";
	var input_data = [data.user.account, data.user.account];

	tokenContract.methods.balanceOf(data.user.account).call()
	.then((result) => {
		data.user.balance = result;

		conn.query(sql, input_data, (err, rows) => {
			data.rows = rows;

			res.render('log', data)
		});	
	});
});


router.post('/transfer_deposit', function(req, res, next) {
	let data = {
		from: main.account,
		to: req.session.user_account,
		value: 5000,
		memo: "무령왕릉"
	};

	var conn = mysql.createConnection(conn_info);
	var sql = "insert into log values (NULL, ?, ?, ?, ?, ?, ?, now())";
	var input_data = [data.from, main.name, data.to, req.session.user_name, data.value, data.memo];

	web3.eth.personal.unlockAccount(main.account, "1234", 1000)
	.then(() => {
		tokenContract.methods.transfer(data.to, data.value).send()
		.then((rec) => {
			conn.query(sql, input_data, (err) => {
				conn.end();
				res.redirect('log');
			});
		});
	});
});

router.post('/transfer_withdraw', function(req, res, next) {
	let data = {
		from: req.session.user_account,
		to: req.body.to,
		value: req.body.value,
		memo: req.body.memo
	};

	var conn = mysql.createConnection(conn_info);
	var sql = "insert into log values (NULL, ?, ?, ?, (select distinct member.Name from member where member.Account = ?), ?, ?, now())";
	var input_data = [data.from, req.session.user_name, data.to, data.to, data.value, data.memo];

	web3.eth.personal.unlockAccount(main.account, "1234", 1000)
	.then(() => {
		tokenContract.methods.setMain().send()
		.then((rec) => {
			tokenContract.methods.approveMain(data.from, data.value).send()
			.then((rec) => {
				tokenContract.methods.transferFrom(data.from, data.to, data.value).send()
				.then((rec) => {
					conn.query(sql, input_data, function(err) {
						conn.end();
						res.redirect("log");
					});
				});
			});
		});
	});
});

router.get('/home', (req, res, next) => {
	let data = {
		user: {
			name: req.session.user_name,
			account: req.session.user_account,
			balance: null
		},
		rows: null	
	}

	var conn = mysql.createConnection(conn_info);
	var sql = "select * from sight ORDER BY S_idx DESC LIMIT 3";

	tokenContract.methods.balanceOf(data.user.account).call()
	.then((result) => {
		data.user.balance = result;
	})
	.then(() => {
		conn.query(sql, function(err, rows) {
			data.rows = rows;
			res.render('home', data);
		});
	});
});


router.get('/deposit', (req, res, next) => {
	let data = {
		user: {
			name: req.session.user_name,
			account: req.session.user_account,
			balance: null
		}
	}

	res.render('deposit', data);
});

router.get('/withdraw', (req, res, next) => {
	let data = {
		balance: null
	}
	
	tokenContract.methods.balanceOf(req.session.user_account).call()
	.then((result) => {
		data.balance = result;
		res.render('withdraw', data);
	});
});

router.get('/sight', (req, res, next) => {
	let data = {
		rows: null
	};

	var conn = mysql.createConnection(conn_info);
	var sql = "select * from sight ORDER BY S_idx DESC LIMIT 3";
	
	conn.query(sql, function(err, rows) {
		data.rows = rows;
		res.render('sight', data);
	});
});

router.get('/shop', (req, res, next) => {
	let data = {}

	res.render('shop', data);
});

router.get('/sight/01', (req, res, next) => {
	let data = {};

	res.render('./sight/01', data);
});

router.get('/sight/02', (req, res, next) => {
	let data = {};

	res.render('./sight/02', data);
});

router.get('/sight/03', (req, res, next) => {
	let data = {};

	res.render('./sight/03', data);
});

module.exports = router;
