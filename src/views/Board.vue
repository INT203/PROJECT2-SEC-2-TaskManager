<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { todoManipulation } from '../lib/todoManipulation'
import postIt from '../components/postIt.vue'
import PostItDetail from '../components/PostItDetail.vue'
import AddPostit from '../components/AddPostit.vue'
import Navbar from '../components/Navbar.vue'
import SideBar from '../components/SideBar.vue'

const prop = defineProps({
    user: Object
})
const emit = defineEmits(['loginUser'])
const router = useRouter()
const { readTodo, setTodoDone, createTodo, dateFormat, removeTodoOnDeletedBoard, removeTodo } = todoManipulation()
let selected = ref(0)
let board = ref(["Default board"])
let tags = ["Academia", "Work", "Hobby", "Routine", "Important", "Moderate", "Low", "Critical!!!"]
let selectedPostit = ref('')
let isShowDetail = ref(false)
let isShowPostIt = ref(false)
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
let aDay = 1000 * 60 * 60 * 24
let sevenHours = 1000 * 60 * 60 * 7
let selectedBoard

selectedPostit.value = {
    topic: '',
    tags: [],
    description: '',
    createdDate: new Date(),
    dueDate: new Date(),
    board: ''
}


// Life Cycle Hook section

onMounted(async () => {
    await reloadUserData()
    reminder()
})

onUnmounted(() => {
    localStorage.setItem('isLoggedIn', "false")
})

// Update Data on Webpage

const reloadUserData = async () => {
    try {
        let resp = await fetch(`http://localhost:3001/user/${currentUser.value.id}`)
        let data = await resp.json()
        currentUser.value = data
        board.value = data.board
        await reloadTodo()
    }

    catch (error) {
        alert('Error fetching user data: ', error);
    };
}

const reloadTodo = async () => {
    if (selected.value >= 0) {
        selectedBoard = board.value[selected.value]
        let todoList = await readTodo(currentUser.value.id)
        todoList = dateFormat(todoList).filter(e => e.board === selectedBoard)
        // Search with Desc or Topic
        todoList = todoList.filter(todo => todo.topic.toLowerCase().includes(searchBox.value.toLowerCase().trim()) || todo.description.toLowerCase().includes(searchBox.value.toLowerCase().trim()))
        todoList = searchTags.value.includes("None") ? todoList.filter(todo => todo.tags.length === 0) : todoList.filter(todo => searchTags.value.every(tag => todo.tags.includes(tag)))
        todoOnBoard.value = todoList
    } else {
        todoOnBoard.value = dateFormat(todoRemind.value[selectedBoard])
    }
}

// Event Handler section 

const searchingHandler = (value) => {
    searchTags.value = value[0]
    searchBox.value = value[1]
}

const showReminderHandler = async (board) => {
    selected.value = -1
    selectedBoard = board
    await reloadUserData()
}

const createTodoHandler = async (data) => {
    await reloadUserData()
    await createTodo(currentUser.value, data.topic, data.tags, data.description, data.createdDate, data.dueDate, data.board)
    await reloadTodo()
    reminder()
}

const showDetailHandler = (item) => {
    isShowDetail.value = true
    isDim.value = true
    selectedPostit.value = item
    reloadUserData()
}

const removePostitHandler = async () => {
    let postitcDate = selectedPostit.value.createdDate
    await removeTodo(currentUser.value, postitcDate)
    reloadUserData()
    reminder()
    closeOvelay()


    selectedPostit.value = {
        topic: '',
        tag: [],
        description: '',
        createdDate: new Date(),
        dueDate: new Date(),
        board: ''
    }
}

const addBoardHandler = async () => {
    addboardmodal.value.checked = false
    currentUser.value.board.push(newBoard.value)
    await fetch(`http://localhost:3001/user/${currentUser.value.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(currentUser.value)
    })
    selected.value = board.value.length - 1
    newBoard.value = ''
    await reloadUserData()
}

const removeBoardHandler = async (rmBoard) => {
    if (board.value.length != 1) {
        currentUser.value.board = board.value.filter(x => x != rmBoard)
        await removeTodoOnDeletedBoard(currentUser.value, rmBoard)
        await reloadUserData()
        reminder()
        selected.value = 0

    }
}

const deleteAccountHandler = async () => {
    await fetch(`http://localhost:3001/user/${currentUser.value.id}`, {
        method: "DELETE"
    })
    router.push("/login")
}

const setTodoDoneHandler = async (data) => {
    await setTodoDone(currentUser.value, data)
    closeOvelay()
}

// Reminder section

const todoRemind = ref({
    "OneDayLeft": [],
    "TwoDayLeft": [],
    "ThreeDayLeft": [],
    "Late": [],
    "Remind": false
})

setInterval(async () => {
    if (dateNow.getHours() == 0 && dateNow.getMinutes() == 0 && 0 < dateNow.getSeconds() < 5) {
        reminder()
    }
}, 1000)  // Update Reminder when passing midnight

const reminder = async () => {
    await readTodo(currentUser.value.id)
        .then(todoList => {

            todoRemind.value = {
                "OneDayLeft": [],
                "TwoDayLeft": [],
                "ThreeDayLeft": [],
                "Late": [],
                "Remind": []
            }

            for (const todo of todoList) {
                let dueDate = new Date(todo.dueDate)
                let range = Math.floor((dueDate.getTime() - dateNow.getTime()) - sevenHours)
                let inday = range / aDay

                if (todo.done === false) {
                    if (inday <= -1) todoRemind.value["Late"].push(todo)
                    else if (inday <= 1) {
                        todoRemind.value["OneDayLeft"].push(todo)
                        todoRemind.value["Remind"].push(todo)
                    }
                    else if (inday <= 2) {
                        todoRemind.value["TwoDayLeft"].push(todo)
                        todoRemind.value["Remind"].push(todo)
                    }
                    else if (inday <= 3) {
                        todoRemind.value["ThreeDayLeft"].push(todo)
                        todoRemind.value["Remind"].push(todo)
                    }
                }

            }
            return todoRemind.value
        }).catch(err => alert(err))
}

// UI display control section

let isValid = computed(() => {
    let obj = {}
    obj['IsExist'] = board.value.includes(newBoard.value)
    obj['IsEmpty'] = newBoard.value.trim().length === 0
    return obj
})

const closeOvelay = async () => {
    isShowDetail.value = false
    isDim.value = false
    isShowPostIt.value = false
    isShowLogin.value = false
    drawerCheck.value = false
    reminder()
    await reloadUserData()

}

const showAddPost = () => {
    isDim.value = true
    isShowPostIt.value = true
}

document.addEventListener("keydown", async function (event) {
    if (event.code === "Escape" && (isShowDetail.value == true || isShowPostIt.value == true)) {
        await closeOvelay()
    }
})

// Get item section

const findBoardName = (selectedPage) => {
    return board.value[selectedPage]
}

const boardFromList = async (selectboard) => {
    selected.value = board.value.indexOf(selectboard)
    await closeOvelay()
}
</script>
 
<template>
    <div class="drawer" v-if="$route.path !== '/login'">
        <input v-model="drawerCheck" id="menu-drawer" type="checkbox" class="drawer-toggle" />
        <div class="drawer-content">
            <!-- NAV BAR -->
            <Navbar @reload="reloadTodo()" @searching="searchingHandler" @showLogin="isShowLogin = !isShowLogin;"
                @showReminder="showReminderHandler" :board-name="findBoardName(selected)" :tags="tags"
                :todoRemind="todoRemind">
            </Navbar>

            <!-- Dim -->
            <div class="absolute h-screen w-screen bg-black opacity-50 z-30 " v-show="isDim" @click="closeOvelay">
            </div>

            <!-- Show Detail -->
            <PostItDetail :postIt="selectedPostit" @setDone="(data) => setTodoDoneHandler(data)" v-show="isShowDetail">
            </PostItDetail>

            <!-- ADD POST-IT -->
            <AddPostit @close="closeOvelay" :board="findBoardName(selected)" :tags="tags"
                @create="(data) => createTodoHandler(data)" v-show="isShowPostIt"> </AddPostit>

            <!-- BUTTON LEFT [PRIVIOUS BOARD] //CANNOT CLICK IN FIRST BOARD -->
            <div class="h-full w-full bg-slate-900 m-auto flex">
                <button @click="() => { selected <= 0 ? 0 : selected--; reloadTodo() }"
                    :class="[selected < 0 ? ' opacity-40' : '', 'h-24 w-24 absolute left-7 top-1/2 -translate-y-1/2 bg-slate-200 z-10 rounded-full transition ease-out duration-500']"
                    :disabled="selected < 1">
                    <span
                        :class="['material-symbols-outlined', selected === 0 ? 'opacity-40' : '', 'text-black text-6xl font-bold pl-5']">
                        arrow_back_ios
                    </span>
                </button>

                <!-- BOARD -->
                <div id="board"
                    class="w-10/12 h-5/6 justify-start overflow-auto m-auto absolute  left-1/2 -translate-x-1/2 -translate-y-1/2 p-12 bg-white grid lg:grid-cols-4 md:grid-cols-2 lg:gap-4 md:gap-6 sm:grid-cols-1 sm:gap-12 rounded-xl my-scrollbar board-top">
                    <!-- POST_IT -->
                    <postIt v-for="card in todoOnBoard" :card="card" @click="showDetailHandler(card)"></postIt>
                </div>

                <!-- CREATE POST-IT BUTTON  -->
                <div v-if="selected >= 0"
                    class="bg-slate-500 h-20 w-20 rounded-xl absolute right-5 bottom-5 opacity-50 hover:opacity-100 hover:cursor-pointer flex"
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

        </div>

        <div class="drawer-side" v-show="drawerCheck">
            <SideBar :boards="board" @close="closeOvelay()" @remove="(data) => removeBoardHandler(data)"
                @goToBoard="(data) => boardFromList(data)"></SideBar>
        </div>
    </div>

    <!-- CREATE BOARD FORM -->
    <Teleport to="body">
        <input type="checkbox" id="add-board-modal" class="modal-toggle" ref="addboardmodal" />
        <label for="add-board-modal" class="modal cursor-pointer super_front">
            <label class="modal-box relative" for="">
                <label for="add-board-modal" class="btn btn-sm btn-circle absolute right-4 top-4 cursor-pointer">✕</label>
                <h3 class="font-bold text-2xl w-fit">Create New Board</h3>
                <input type="text" v-model="newBoard" class="input input-bordered mt-3" placeholder="Board Name" />
                <p class="pl-1 mt-2 text-red-600">{{ isValid.IsEmpty ? "Board name can't be empty!" :
                    isValid.IsExist ? "This board is already existed !" : "" }}</p>
                <div class="modal-action">
                    <button @click="addBoardHandler" :for="['add-board-modal']" :class="['btn']"
                        :disabled="isValid.IsEmpty || isValid.IsExist"> Create</button>
                </div>
            </label>
        </label>    
    </Teleport>

    <!-- Remove Post-it Warning -->
    <Teleport to="body">
        <input type="checkbox" id="remove-modal" class="modal-toggle" />
        <div class="modal">
            <div class="modal-box  bg-red-400">
                <h3 class="font-bold text-2xl text-white">Warning</h3>
                <p class="py-4 text-white">This will permanant remove this post-it. Are you sure about this?</p>
                <div class="modal-action">
                    <label for="remove-modal" class="btn">Abort</label>
                    <label for="remove-modal" @click="removePostitHandler" class="btn">Confirm</label>
                </div>
            </div>
        </div>
    </Teleport>
    <Teleport to="body">
        <input type="checkbox" id="delete-acc" class="modal-toggle" />
        <div class="modal modal-bottom sm:modal-middle">
            <div class="modal-box bg-red-400 text-white">
                <h3 class="font-bold text-2xl">Warning!</h3>
                <hr>
                <p class="py-4">Your account will be deleted permanently. Are you sure about deleting.</p>
                <div class="modal-action">
                    <label for="delete-acc" class="btn">Abort</label>
                    <label for="delete-acc" @click="deleteAccountHandler" class="btn">Confirm</label>
                </div>
            </div>
        </div>
    </Teleport>
</template>
 
<style scoped></style>