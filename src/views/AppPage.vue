<script setup>
import { ref, computed, onUpdated, onMounted, onBeforeMount, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { todoManipulation } from '../lib/todoManipulation'
import postIt from '../components/postIt.vue'
import PostItDetail from '../components/PostItDetail.vue'
import AddPostit from '../components/AddPostit.vue'
import Navbar from '../components/Navbar.vue'
import SideBar from '../components/SideBar.vue'
import CreateAcc from '../components/CreateAcc.vue'
import LoginPanel from '../components/LoginPanel.vue'

const prop = defineProps({
    user : Object
})
const router = useRouter()
const { readTodo, setTodoDone, createTodo, dateFormat, removeTodoOnDeletedBoard, removeTodo } = todoManipulation()
let selected = ref(0)
let board = ref(["Default board"])
let tags = ["Academia", "Work", "Hobby", "Routine", "Important", "Moderate", "Low", "Critical!!!"]
let selectedPoseit = ref('')
let isShowD = ref(false)
let isShowP = ref(false)
let isShowLogin = ref(false)
let newBoard = ref('')
let isDim = ref(false)
let addboardmodal = ref()
let drawerCheck = ref(false);
let searchTags = ref([])
let searchBox = ref('')
let todoOnBoard = ref([])
let currentUser = ref(prop.user)
let dateNow = new Date()
let aDay = 1000*60*60*24
let sevenHours = 1000*60*60*7
onMounted(() => {
    console.log(prop.user)
    reloadUserData()
.then(() => reloadTodo())
})

onUnmounted(() => {
    console.log("UNMOUNT???")
    localStorage.setItem('isLoggedIn', "false")

})

const reloadUserData = async () => {
    await fetch(`http://localhost:3001/user/${currentUser.value.id}`)
        .then(resp => resp.json())
        .then(data => {
            currentUser.value = data
            board.value = data.board
        })
        .catch(error => {
            console.error('Error fetching user data:', error);
        });
}

const handleSeaching = (value) => {
    searchTags.value = value[0]
    searchBox.value = value[1]
}

const createTodoHandler = (data) => {
    reloadUserData()
        .then(() => createTodo(currentUser.value, data.topic, data.tags, data.description, data.createdDate, data.dueDate, data.board))
        .then(() => reloadTodo())
        .then(() => reminder())
}

selectedPoseit.value = {
    topic: '',
    tags: [],
    description: '',
    createdDate: new Date(),
    dueDate: new Date(),
    board: ''
}

onMounted(() => {
    reloadTodo()
    reloadUserData()
    reminder()
})

const todoRemind = ref({
      "OneDayLeft" : [],
      "TwoDayLeft" : [],
      "ThreeDayLeft" : [],
      "Late" : [],
      "Remind" : false
})


setInterval(async ()=>{
    if (dateNow.getHours() == 0 && dateNow.getMinutes() == 0 && 0 < dateNow.getSeconds() < 5 ){
        reminder()
    }
},1000)  //EDIT
    
const reminder = () =>{
    readTodo(currentUser.value.id)
    .then(todoList => {

        todoRemind.value = {
            "OneDayLeft" : [],
            "TwoDayLeft" : [],
            "ThreeDayLeft" : [],
            "Late" : [],
            "Remind" : []
        }

        for (const todo of todoList) {
            let dueDate = new Date(todo.dueDate)
            let range = Math.floor((dueDate.getTime()-dateNow.getTime())-sevenHours)
            let inday = range/aDay

            if(todo.done === false){
                    if(range <= 0) todoRemind.value["Late"].push(todo)
                    if(inday > 0 && inday <= 1 ){
                        todoRemind.value["OneDayLeft"].push(todo)
                        todoRemind.value["Remind"].push(todo)
                    }
                    if(inday > 1 && inday <= 2){
                        todoRemind.value["TwoDayLeft"].push(todo)
                        todoRemind.value["Remind"].push(todo)
                    }
                    if(inday > 2 && inday <= 3){
                        todoRemind.value["ThreeDayLeft"].push(todo)
                        todoRemind.value["Remind"].push(todo)
                    }
            }
            
        }
        //   console.log(todoRemind.value)
        return todoRemind.value
    }).catch(err => console.log(err))
}

const reloadTodo = () => {
    let selectedBoard = board.value[selected.value]
    readTodo(currentUser.value.id)
        .then(todoList => dateFormat(todoList))
        .then(todoList => todoList.filter(e => e.board === selectedBoard))
        .then(todoList => todoList.filter(todo => todo.topic.toLowerCase().includes(searchBox.value.toLowerCase().trim()) || todo.description.toLowerCase().includes(searchBox.value.toLowerCase().trim())))
        .then(todoList => searchTags.value.includes("None") ? todoList.filter(todo => todo.tags.length === 0) : todoList.filter(todo => searchTags.value.every(tag => todo.tags.includes(tag))))
        .then(FilteredtodoList => todoOnBoard.value = FilteredtodoList)
}



let isValid = computed(() => {
    let obj = {}
    obj['IsExist'] = board.value.includes(newBoard.value)
    obj['IsEmpty'] = newBoard.value.trim().length === 0
    return obj
})

const findBoardName = (selectedPage) => {
    return board.value[selectedPage]
}

const showDetail = (item) => {
    isShowD.value = true
    isDim.value = true
    selectedPoseit.value = item
    reloadUserData()
}

const closeOvelay = () => {
    isShowD.value = false
    isDim.value = false
    isShowP.value = false
    isShowLogin.value = false
    drawerCheck.value = false
    reloadTodo()
    reminder()
}


document.addEventListener("keydown", function (event) {
    if (event.code === "Escape" && (isShowD.value == true || isShowP.value == true)) {
        closeOvelay()
    }
});

const removePoseit = () => {
    let postitcDate = selectedPoseit.value.createdDate
    reloadUserData()
        .then(() => removeTodo(currentUser.value, postitcDate))
        .then(() => reloadTodo())
        .then(() => reloadUserData())
        .then(() => reminder())

    selectedPoseit.value = {
        topic: '',
        tag: [],
        description: '',
        createdDate: new Date(),
        dueDate: new Date(),
        board: ''
    }
    closeOvelay()
}

const removeBoard = (rmBoard) => {
    if (board.value.length != 1) {
        reloadUserData()
            .then(removeTodoOnDeletedBoard(currentUser.value, rmBoard))
            .then(currentUser.value.board = board.value.filter(x => x != rmBoard))
            .then(fetch(`http://localhost:3001/user/${currentUser.value.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(currentUser.value)
            }
            )
            ).then(() => reloadUserData())
            .then(() => reminder())

        selected.value = 0
    }
}

const showAddPost = () => {
    isDim.value = true
    isShowP.value = true
}


const boardFromList = (selectboard) => {
    selected.value = board.value.indexOf(selectboard)
    closeOvelay()
}

const addBoard = () => {
    addboardmodal.value.checked = false
    currentUser.value.board.push(newBoard.value)
    console.log(currentUser.value.board)
    reloadUserData()
        .then(fetch(`http://localhost:3001/user/${currentUser.value.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(currentUser.value)
        }))

        .then(() => reloadUserData())
    selected.value = board.value.length - 1
    newBoard.value = ''
}
</script>
 
<template>
    <div class="drawer" v-if="$route.path !== '/login'">
        <input v-model="drawerCheck" id="menu-drawer" type="checkbox" class="drawer-toggle" />
        <div class="drawer-content">
            <!-- NAV BAR -->
            <Navbar @reload="reloadTodo()" @searching="handleSeaching" @showLogin="isShowLogin = !isShowLogin;"
                :board-name="findBoardName(selected)" :tags="tags" :todoRemind="todoRemind">
            </Navbar>

            <!-- Dim -->
            <div class="absolute h-screen w-screen bg-black opacity-50 z-30 " v-show="isDim" @click="closeOvelay">
            </div>

            <!-- <CreateAcc @setCurrent="(user) => handleLogingUser(user)" v-show="true" :isDim=true></CreateAcc> -->

            <!-- <LoginPanel @close="closeOvelay" @loginUser="(user) => handleLogingUser(user)" v-show="isShowLogin">
            </LoginPanel> -->

            <!-- Show Detail -->
            <PostItDetail :postIt="selectedPoseit"
                @setDone="(data) => { setTodoDone(currentUser, data).then(() => closeOvelay()) }" v-show="isShowD">
            </PostItDetail>

            <!-- ADD POST-IT -->
            <AddPostit @close="closeOvelay" :board="findBoardName(selected)" :tags="tags"
                @create="(data) => createTodoHandler(data)" v-show="isShowP"> </AddPostit>

            <!-- BUTTON LEFT [PRIVIOUS BOARD] //CANNOT CLICK IN FIRST BOARD -->
            <div class="h-full w-full bg-slate-900 m-auto flex">
                <button @click="() => { selected <= 0 ? 0 : selected--; reloadTodo() }"
                    :class="[selected === 0 ? ' opacity-40' : '', 'h-24 w-24 absolute left-7 top-1/2 -translate-y-1/2 bg-slate-200 z-10 rounded-full transition ease-out duration-500']"
                    :disabled="selected === 0">
                    <span
                        :class="['material-symbols-outlined', selected === 0 ? 'opacity-40' : '', 'text-black text-6xl font-bold pl-5']">
                        arrow_back_ios
                    </span>
                </button>

                <!-- BOARD -->
                <div id="board"
                    class="w-10/12 h-5/6 justify-start overflow-auto m-auto absolute  left-1/2 -translate-x-1/2 -translate-y-1/2 p-12 bg-white grid lg:grid-cols-4 md:grid-cols-2 lg:gap-4 md:gap-6 sm:grid-cols-1 sm:gap-12 rounded-xl my-scrollbar board-top">
                    <!-- POST_IT -->
                    <postIt v-for="card in todoOnBoard" :card="card" @click="showDetail(card)"></postIt>
                </div>

                <!-- CREATE POST-IT BUTTON  -->
                <div class="bg-slate-500 h-20 w-20 rounded-xl absolute right-5 bottom-5 opacity-50 hover:opacity-100 hover:cursor-pointer flex"
                    @click="showAddPost">
                    <img src="/images/postit-icon.png" alt="post-it-picture-logo" class="w-16 m-auto">
                </div>
                <!-- BUTTON RIGHT [NEXT BOARD] -->
                <button @click="() => { selected >= board.length - 1 ? board.length - 1 : selected++; reloadTodo() }"
                    class="h-24 w-24 absolute right-7 top-1/2 -translate-y-1/2 bg-slate-200 z-10 rounded-full"
                    v-show="selected !== board.length - 1">
                    <span class="material-symbols-outlined text-black text-6xl font-bold pl-5">
                        arrow_forward_ios
                    </span>
                </button>

                <!-- CREATE BOARD BUTTON [ADD BOARD] //SHOW WHEN NO MORE BOARD -->
                <label for="add-board-modal"
                    class="h-24 w-24 absolute right-7 top-1/2 -translate-y-1/2  bg-slate-200 z-10 rounded-full"
                    v-show="selected === board.length - 1">
                    <span
                        class="material-symbols-outlined text-black text-6xl font-bold absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                        add
                    </span>
                </label>
            </div>

            <!-- CREATE BOARD FORM -->
            <input type="checkbox" id="add-board-modal" class="modal-toggle" ref="addboardmodal" />
            <label for="add-board-modal" class="modal cursor-pointer super_front">
                <label class="modal-box relative" for="">
                    <label for="add-board-modal"
                        class="btn btn-sm btn-circle absolute right-4 top-4 cursor-pointer">✕</label>
                    <h3 class="font-bold text-2xl w-fit">Create New Board</h3>
                    <input type="text" v-model="newBoard" class="input input-bordered mt-3" placeholder="Board Name" />
                    <p class="pl-1 mt-2 text-red-600">{{ isValid.IsEmpty ? "Board name can't be empty!" :
                        isValid.IsExist ? "This board is already existed !" : "" }}</p>
                    <div class="modal-action">
                        <button @click="addBoard" :for="['add-board-modal']" :class="['btn']"
                            :disabled="isValid.IsEmpty || isValid.IsExist"> Create</button>
                    </div>
                </label>
            </label>
        </div>

        <div class="drawer-side" v-show="drawerCheck">
            <SideBar :boards="board" @close="closeOvelay()" @remove="(data) => removeBoard(data)"
                @goToBoard="(data) => boardFromList(data)"></SideBar>
        </div>
    </div>
    <!-- Remove Pose-it Warning -->
    <input type="checkbox" id="remove-modal" class="modal-toggle" />
    <div class="modal">
        <div class="modal-box  bg-red-400">
            <h3 class="font-bold text-2xl text-white">Warning</h3>
            <p class="py-4 text-white">This will permanant remove this pose-it. Are you sure about this?</p>
            <div class="modal-action">
                <label for="remove-modal" class="btn">Abort</label>
                <label for="remove-modal" @click="removePoseit" class="btn">Confirm</label>
            </div>
        </div>
    </div>
</template>
 
<style scoped></style>