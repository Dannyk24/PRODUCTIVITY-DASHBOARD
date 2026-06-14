const navListItems = document.querySelectorAll('.nav-item')
const sections = document.querySelectorAll('section')
let activeTab = loadActiveTab()



navListItems.forEach(item=>{
    item.addEventListener('click',()=>{
        setActiveTab(item.dataset.section)
    })
})

function saveActiveTab(tabName){
    localStorage.setItem('active-tab', tabName)
}
function loadActiveTab(){
    return localStorage.getItem('active-tab') || 'home'
}

function setActiveTab(tabName){
    navListItems.forEach(item=>{
        item.classList.toggle('active', 
            item.dataset.section === tabName
        )
    })

    sections.forEach((section)=>{
        section.classList.toggle('active-section',
            section.dataset.section === tabName
        )
    })

    activeTab = tabName
    saveActiveTab(tabName)
}

setActiveTab(activeTab)



/*==========HANDLE CARD CLICKS==============*/

const cards = document.querySelectorAll('.card')
    cards.forEach(card=>{
    card.addEventListener('click',()=>{
        setActiveTab(card.dataset.section)
    })
})






/*==========TASKS PAGE SCRIPT===========*/

let taskList = getTasks()
let taskContainer = document.querySelector('.task-list')
const emptyState = document.querySelector('.empty-state')

function renderTasks(){
    taskContainer.innerHTML = ''
    taskList.forEach((task,index)=>{
        const taskHtml = `
        <div>
            <span>${task}</span>
            <button class = "delete-task-btn" data-index="${index}">Delete</button>
        </div>`
        taskContainer.innerHTML += taskHtml
    })
}


taskContainer.addEventListener('click',event=>{
    if(!event.target.classList.contains('delete-task-btn')){
        return
    }
    const index = event.target.dataset.index
    deleteTask(index)
})

function deleteTask(index){
    taskList.splice(index,1)
    saveTasks()
    renderTasks()
    checkState()
}




function checkState(){
    emptyState.classList.toggle('fill-state',
        taskList.length > 0
    )
}

function saveTasks(){
    localStorage.setItem('task-list', JSON.stringify(taskList))
}
function getTasks(){
    return JSON.parse(localStorage.getItem('task-list')) || []
}

function addTask(){
    const task = document.querySelector('.task-name').value
    if (!task.trim() || !task){
        alertUser('invalid Task Name', 'red')
        document.querySelector('.task-name').value = ''
        return
    }
    taskList.push(task)
    document.querySelector('.task-name').value = ''
    alertUser('Task added')
    saveTasks()
    renderTasks()
    checkState()
}

document.querySelector('.task-name').addEventListener('keydown',e=>{
    if(e.key === 'Enter'){
        addTask()
    }
})


const addTaskBtn = document.querySelector('.add-task-btn')
addTaskBtn.addEventListener('click',addTask)



function alertUser(content, color='green'){
    const notify = document.querySelector('.alert')
    notify.textContent = content
    notify.classList.add('alert-active')
    notify.style.backgroundColor = color
    
    setTimeout(()=>{
        notify.classList.remove('alert-active')
    },2500)
}

checkState()
renderTasks()




/*===========SETTINGS============*/
const colorMode = localStorage.getItem('colorMode') || 'light'
if(colorMode === 'dark'){
    document.body.classList.add('dark-mode')
}
else{
    document.body.classList.remove('dark-mode')
}
const darkModeBtn = document.querySelector('.toggle-btn')
function toggleColorMode(){
    document.body.classList.toggle('dark-mode')
    if(document.body.classList.contains('dark-mode')){
        localStorage.setItem('colorMode','dark')
    }
    else{
        localStorage.setItem('colorMode','light')
    }
}
darkModeBtn.addEventListener('click',toggleColorMode)

const clearTasksBtn = document.querySelector('.danger-btn')
const clearTasksAlert = document.querySelector('.confirm-clear-tasks')
const overlay = document.querySelector('.overlay')
console.log(clearTasksBtn.tagName);

clearTasksBtn.addEventListener('click',(event)=>{
    clearTasks(event)
})



function confirmClearTasks(type){
    if(type === 'show'){
        overlay.classList.add('active-overlay')
        clearTasksAlert.classList.add('confirm-clear-tasks-active')
    }
    else if(type === 'remove'){
        overlay.classList.remove('active-overlay')
        clearTasksAlert.classList.remove('confirm-clear-tasks-active')
    }
}
function clearTasks(event){
    confirmClearTasks('show')
    clearTasksAlert.addEventListener('click',(event)=>{
        if(event.target.tagName !== 'BUTTON'){
        return
    }
    else if(event.target.dataset.action === 'yes'){
        taskList=[]
        localStorage.removeItem('task-list')
        setActiveTab('tasks')
        renderTasks()
        checkState()
        confirmClearTasks('remove')
        alertUser('All tasks cleared')
    }
    else if(event.target.dataset.action === 'no'){
        confirmClearTasks('remove')
        alertUser('Opearation cancelled by user', 'blue')
    }
    })
}


/*===========NOTES==========*/

const notesContainer = document.querySelector('.notes-list')
const addNoteBtn = document.querySelector('.add-note-btn')


addNoteBtn.addEventListener('click', addNote)

let notesList = getNotes()



function renderNotes(){
    if (notesList.length === 0) {
    notesContainer.innerHTML = '<p class="empty-notes">No notes yet</p>'
    return
  }
    notesContainer.innerHTML = ''
    notesList.forEach((note,index)=>{
    let html = `
    <div class="note" data-index="${index}">
          <textarea name="" id="" readonly>${note}
          </textarea>
          <div class="action-btns">
            <button class="edit-note-btn" data-action="edit">Edit</button>
            <button class="update-note-btn" data-action="update">Update</button>
            <button class="delete-note-btn" data-action="delete">Delete</button>
          </div>
    </div>
    `
    notesContainer.innerHTML+= html
    })
}


function getNotes(){
    return JSON.parse(localStorage.getItem('notesList')) || []
}


function saveNotes(){
    localStorage.setItem('notesList', JSON.stringify(notesList))
}


function addNote(){
    const noteContent = document.querySelector('.new-note').value
    if (!noteContent.trim()) {
        alertUser('Note cannot be empty', 'red')
        return
    }
    notesList.push(noteContent)
    document.querySelector('.new-note').value = ''
    alertUser('Note added')
    saveNotes()
    renderNotes()
}

function updateUi(){
    saveNotes()
    renderNotes()
}

notesContainer.addEventListener('click',e=>{
    if(e.target.classList.contains('edit-note-btn')){
        const note = e.target.closest('.note')
        const textContent = note.children[0]
        textContent.removeAttribute('readonly')
        textContent.classList.add('active-note-textarea')
    }
    else if(e.target.classList.contains('update-note-btn')){
        const note = e.target.closest('.note')
        const textContent = note.children[0]
        const newTextContentValue = textContent.value
        textContent.setAttribute('readonly',true)
        textContent.classList.remove('active-note-textarea')
        const noteIndex = note.dataset.index
        notesList[noteIndex] = newTextContentValue.trim()
        alertUser('Note Updated')
        updateUi()
    }
    else if(e.target.classList.contains('delete-note-btn')){
        const note = e.target.closest('.note')
        notesList.splice(note.dataset.index,1)
        alertUser('Note Deleted','red')
        updateUi()
    }
})





renderNotes()


