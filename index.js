import PocketBase from './pocketbase.es.mjs'

const url = 'https://cckh2024.pockethost.io/'
const client = new PocketBase(url)

async function getAllExpenses() {
  const records = await client.collection('expenses').getFullList()
  return records
}

async function displayAllExpenses() {
  const expenses = await getAllExpenses()
  console.log(expenses)
  const wrapper = document.querySelector(".wrapper")
  // console.log(wrapper)
  wrapper.innerHTML = ``

  for (let i = 0; i < expenses.length; i++) {
    let currentExpense = expenses[i]
    // console.log(currentExpense)
    wrapper.innerHTML = wrapper.innerHTML + `
    <div class="expenseItem" data-aos="fade-up" data-aos-delay="${250*i}">
      <p>${new Date(currentExpense.date).toLocaleDateString()}</p>
      <h4>${currentExpense.name}</h4>
      <p>${currentExpense.amount} USD</p>
      <p id="tag">${currentExpense.category}</p>
      <div class="btnGroup">
        <button class="btn" id="editBtn">Edit</button>
        <button class="btn" id="deleteBtn" data-recordid="${currentExpense.id}">Delete</button>
      </div>
    </div>
    `
  }

  const deleteBtns = document.querySelectorAll("#deleteBtn")
  // console.log(deleteBtns)
  for (let i = 0; i < deleteBtns.length; i++) {
    let currentBtn = deleteBtns[i]
    currentBtn.addEventListener("click", async () => {
      // console.log(currentBtn.dataset.recordid)
      await client.collection('expenses').delete(currentBtn.dataset.recordid)
      displayAllExpenses()
    })
  }

  displayChart(expenses)
}

function addNewExpense() {
  const form = document.querySelector("#createExpense")
  form.addEventListener("submit", async (e) => {
    e.preventDefault()

    const expenseDate = document.querySelector("#date")
    const expenseName = document.querySelector("#name")
    const expenseAmount = document.querySelector("#amount")
    const expenseCategory = document.querySelector("#category")

    const data = {
      "name": expenseName.value,
      "amount": parseFloat(expenseAmount.value),
      "date": expenseDate.value,
      "category": expenseCategory.value
    };

    // console.log(data)
    const record = await client.collection('expenses').create(data)
    alert("New data is created successfully")

    expenseDate.value = ``
    expenseName.value = ``
    expenseAmount.value = ``
    expenseCategory.value = ``

    displayAllExpenses()

  })
}


function displayChart(expenses) {

  //food, entertainment, study, health, other
  const data = [
    {
      category: "food",
      amount: 0
    },
    {
      category: "entertainment",
      amount: 0
    },
    {
      category: "study",
      amount: 0
    },
    {
      category: "health",
      amount: 0
    },
    {
      category: "other",
      amount: 0
    }
  ]

  for (let i = 0; i < expenses.length; i++) {
    let expense = expenses[i]
    // console.log(expense)
    if (expense.category == "food") {
      data[0].amount += expense.amount
    } else if (expense.category == "entertainment") {
      data[1].amount += expense.amount
    } else if (expense.category == "study") {
      data[2].amount += expense.amount
    } else if (expense.category == "health") {
      data[3].amount += expense.amount
    } else {
      data[4].amount += expense.amount
    }
  }

  console.log(data)

  let chartStatus = Chart.getChart("myChart"); // <canvas> id
  if (chartStatus != undefined) {
    chartStatus.destroy();
  }

  const ctx = document.getElementById('myChart');

  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: data.map((item) => item.category),
      datasets: [{
        label: 'Amount in USD',
        data: data.map((item) => item.amount),
        borderWidth: 1
      }]
    }
  });




}



window.addEventListener("DOMContentLoaded", async () => {

  displayAllExpenses()
  addNewExpense()

})