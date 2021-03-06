var TomCoin = artifacts.require("./TomCoin.sol");

contract('TomCoin', function(accounts) {
  it("should put 10000 TomCoin in the first account", function() {
    return TomCoin.deployed().then(function(instance) {
      return instance.balanceOf.call(accounts[0]);
    }).then(function(balance) {
      assert.equal(balance.valueOf(), 10000, "10000 wasn't in the first account");
    });
  });
  it("should call a function that depends on a linked library", function() {
    var tom;
    var tomCoinBalance;
    var tomCoinEthBalance;

    return TomCoin.deployed().then(function(instance) {
      tom = instance;
      return tom.balanceOf.call(accounts[0]);
    }).then(function(outCoinBalance) {
      tomCoinBalance = outCoinBalance.toNumber();
      return tom.balanceOfInEth.call(accounts[0]);
    }).then(function(outCoinBalanceEth) {
      tomCoinEthBalance = outCoinBalanceEth.toNumber();
    }).then(function() {
      assert.equal(tomCoinEthBalance, 2 * tomCoinBalance, "Library function returned unexpected function, linkage may be broken");
    });
  });
  it("should send coin correctly", function() {
    var tom;

    // Get initial balances of first and second account.
    var account_one = accounts[0];
    var account_two = accounts[1];

    var account_one_starting_balance;
    var account_two_starting_balance;
    var account_one_ending_balance;
    var account_two_ending_balance;

    var amount = 10;

    return TomCoin.deployed().then(function(instance) {
      tom = instance;
      return tom.balanceOf.call(account_one);
    }).then(function(balance) {
      account_one_starting_balance = balance.toNumber();
      return tom.balanceOf.call(account_two);
    }).then(function(balance) {
      account_two_starting_balance = balance.toNumber();
      return tom.transfer(account_two, amount, {from: account_one});
    }).then(function() {
      return tom.balanceOf.call(account_one);
    }).then(function(balance) {
      account_one_ending_balance = balance.toNumber();
      return tom.balanceOf.call(account_two);
    }).then(function(balance) {
      account_two_ending_balance = balance.toNumber();

      assert.equal(account_one_ending_balance, account_one_starting_balance - amount, "Amount wasn't correctly taken from the sender");
      assert.equal(account_two_ending_balance, account_two_starting_balance + amount, "Amount wasn't correctly sent to the receiver");
    });
  });

  it("should withdraw coin correctly", function() {
    var tom;

    // Get initial balances of first and second account.
    var account_one = accounts[0];
    var manager = accounts[1];
    var account_two = accounts[2];

    var account_one_starting_balance;
    var account_two_starting_balance;
    var manager_starting_balance;
    var account_one_ending_balance;
    var account_two_ending_balance;
    var manager_ending_balance;

    var amount = 10;
    var transfer_to = 40;

    return TomCoin.deployed().then(function(instance) {
      tom = instance;
      return tom.balanceOf.call(account_one);
    }).then(function(balance) {
      account_one_starting_balance = balance.toNumber();
      return tom.balanceOf.call(manager);
    }).then(function(balance) {
      manager_starting_balance = balance.toNumber();
      return tom.transfer_to_contract({ value: 4000, from: account_one });
    }).then(function() {
      return tom.requestWithdrawal(account_one, amount);
    // }).then(function() {
    //   //manager_starting_balance = balance.toNumber();
    //   return tom.withdraw(account_one);
    }).then(function() {
      return tom.balanceOf.call(account_one);
    }).then(function(balance) {
      account_one_ending_balance = balance.toNumber();
      return tom.balanceOf.call(manager);
    }).then(function(balance) {
      manager_ending_balance = balance.toNumber();

      assert.equal(account_one_ending_balance, account_one_starting_balance - amount, "Amount wasn't correctly taken from the sender");
      assert.equal(manager_ending_balance, manager_starting_balance + amount, "Amount wasn't correctly sent to the manager");
    });
  });

  // it("should check eth value correctly", function() {
  //   var tom;
  //
  //   var amount_eth = 1;
  //
  //   var exp = 5;
  //
  //   var amount = 10;
  //
  //   return TomCoin.deployed().then(function(instance) {
  //     tom = instance;
  //     amount_eth = instance.checkEthValue(amount);
  //
  //     assert.equal(amount_eth, exp, "Amount wasn't correctly converted to eth");
  //   });
  // });
});
