/* This app allows users to add incomes and expenses in a certain month 
and then the app calculates how much money we have made, and how much we have spent and
then it gives us the budget*/


//module that handles our budjet data using IIFE. returns an object with all the functions that has to be public
var budgetController = (function() {

    //function constructor for creating objects for expenses
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    //function constructor for creating objects for expenses
    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    //calculate the percentages for each expenses
    Expense.prototype.calcPercentage = function(totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
            /*if (this.percentage > 100) {
                this.percentage = -1;
            }*/
        } else {
            this.percentage = -1;
        }

    };

    //returns the percentages
    Expense.prototype.getPercentage = function() {
        return this.percentage;
    };

    var calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function(curr) {
            sum += curr.value;
        });
        data.totals[type] = sum;
    };

    //data structure object to receive data
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0,
        },
        budget: 0,
        percentage: -1,

    };


    //public methods
    return {
        addItem: function(type, des, val) {
            var newItem, ID;

            //create new id 
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;

            } else {
                ID = 0;
            }

            //create new item based on 'inc' or 'exp' type
            //type is expenses
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            }
            //type is income
            else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }
            //add data to the data object
            data.allItems[type].push(newItem);

            //Return the new element
            return newItem;

        },

        deleteItem: function(type, id) {
            var ids, index;
            //store the ids of a particular type in a array
            ids = data.allItems[type].map(function(current) {
                return current.id;
            });

            //get the index of the id
            index = ids.indexOf(id);


            //remove the number
            if (index !== -1) {
                data.allItems[type].splice(index, 1);

            }

        },

        calculateBudget: function() {

            //calculate total income and expenses

            calculateTotal('exp');
            calculateTotal('inc');


            //calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;

            //calculate the percentage of income that we spent
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
                /*if (data.percentage > 100) {
                    data.percentage = -1;
                }*/
            } else {
                data.percentage = -1;
            }


        },
        calculatePercentages: function() {

            // calculate the expense percentages for each expense objects
            data.allItems.exp.forEach(function(curr) {
                curr.calcPercentage(data.totals.inc);
            });


        },


        getPercentages: function() {

            var allPerc = data.allItems.exp.map(function(curr) {
                return curr.getPercentage()
            });

            return allPerc;
        },

        //returns the budget values
        getBudget: function() {
            return {
                budget: data.budget,
                totalIncome: data.totals.inc,
                totalExpenses: data.totals.exp,
                percentage: data.percentage,
            }
        },
        testing: function() {
            console.log(data);
        }
    };

})();





//module that handles our User Interface using IIFE
var UIController = (function() {
    //private variables to store the dom values
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        itemPercentages: '.item__percentage',
        currentMonth: '.budget__title--month',

    };


    var formatNumber = function(num, type) {
        var numSplit, int, dec;
        /**
         + or - before number
         exactly 2 decimal points
         comma separting the thousands

         2310.4567 -> + 2,310.46
         2000 -> + 2,000.00
         */

        num = Math.abs(num);
        num = num.toFixed(2); // two decimal places

        numSplit = num.split('.');

        int = numSplit[0];
        dec = numSplit[1];

        //splitting between number
        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
        }
        dec = numSplit[1];;
        return (type === 'exp' ? sign = '-' : sign = '+') + ' ' + int + '.' + dec;

    };


    //function to convert a nodelist into an array
    var nodelistForEach = function(list, callback) {
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    };

    // public function to get our input
    return {
        getinput: function() {
            //  returns an object 
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                addValue: parseFloat(document.querySelector(DOMstrings.inputValue).value),
            };

        },

        addListItem: function(obj, type) {
            var html, newHtml, element;
            //create Html string with placeholder text

            if (type === 'inc') {
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }


            //Replace the placeholder text with some actual data

            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));


            //Insert the Html into the DOM

            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);




        },

        deleteListItem: function(selectorID) {
            var element = document.getElementById(selectorID);
            //we can only remove a child
            element.parentNode.removeChild(element);
        },

        //clears the input fields
        clearFields: function() {
            var fields, fieldsArr;

            fields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue);

            //convert the fields to an array
            fieldsArr = Array.from(fields);

            //clear all the variables
            fieldsArr.forEach(function(current, index, arr) {
                current.value = "";
            });

            //set the focus to the first input field
            fieldsArr[0].focus();
        },


        displayBudget: function(obj) {

            var type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';
            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalIncome, 'inc');
            document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExpenses, 'exp');


            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }
        },


        displayPercentages: function(percentages) {

            var fields = document.querySelectorAll(DOMstrings.itemPercentages)




            nodelistForEach(fields, function(current, index) {

                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---';
                }

            });


        },

        displayMonth: function() {
            var months = ['January', 'February', 'March', 'April',
                'May', 'June', 'July', 'August', 'September', 'October',
                'December'
            ]
            var date = new Date();
            var currentMonth = date.getMonth();
            var year = date.getFullYear();

            //update the month span tag
            document.querySelector(DOMstrings.currentMonth).textContent = months[currentMonth] + " " + year;
        },


        changedType: function() {

            var fields = document.querySelectorAll(
                DOMstrings.inputType + ',' +
                DOMstrings.inputDescription + ',' +
                DOMstrings.inputValue)

            fields.forEach(function(fields) {
                fields.classList.toggle('red-focus');
            });

            document.querySelector(DOMstrings.inputButton).classList.toggle('red');
        },



        getDOMstrings: function() {
            return DOMstrings;
        },

    };

})();




//connects the modules together
var AppController = (function(budgetCtrl, UIctrl) {
    //init function
    var setupEventListeners = function() {
        var DOM = UIctrl.getDOMstrings();

        document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);


        document.addEventListener('keypress', function(event) {

            //keycode 13 is Enter
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }


        });


        //event delegation: setting the event on the parent element
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

        document.querySelector(DOM.inputType).addEventListener('change', UIctrl.changedType);
    };

    //updates the budget
    var updateBudget = function() {

        //  1. Calculate the budget
        budgetCtrl.calculateBudget();

        // 2. Return the budget
        var budget = budgetCtrl.getBudget();

        //  3. Display the budget on the UI
        UIctrl.displayBudget(budget);
        // console.log(budget);
    };

    var updatePercentages = function() {

        // 1. Calculate percentages
        budgetCtrl.calculatePercentages();

        // 2. Read percentages from the budget controller
        var percentages = budgetCtrl.getPercentages();

        // 3. Update the UI with the new percentages
        UIctrl.displayPercentages(percentages);
    }


    var ctrlAddItem = function() {
        var input, newItem;
        //  1. Get the field input data
        input = UIController.getinput();

        //check if any of the input fields is not empty
        if (input.description !== "" && !isNaN(input.addValue) && input.addValue > 0) {

            //  2. add the item to the budget controller
            newItem = budgetController.addItem(input.type, input.description, input.addValue);

            //  3. add the item to the UI
            UIctrl.addListItem(newItem, input.type);

            // 4. clear the fields
            UIctrl.clearFields();

            //  5. calculate the budget and update it
            updateBudget();

            // 6. calculate and Update Percentages
            updatePercentages();
        }

    };


    //function to delete item from the page
    var ctrlDeleteItem = function(event) {
        var itemID, splitID, type, ID;
        //Dom traversing
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if (itemID) {

            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            // 1. delete the item form the data structure
            budgetCtrl.deleteItem(type, ID);

            // 2. Delete the item from the UI
            UIctrl.deleteListItem(itemID);

            // 3. Update and show the new budget
            updateBudget();

            // 4. Calculate and update percentages
            updatePercentages();


        }
    };



    return {
        init: function() {
            UIctrl.displayBudget({
                budget: 0,
                totalIncome: 0,
                totalExpenses: 0,
                percentage: -1,

            });
            setupEventListeners();
            UIctrl.displayMonth();
        }
    };

})(budgetController, UIController);
AppController.init();