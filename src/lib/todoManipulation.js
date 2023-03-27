import { Todo } from './todo'
function todoManipulation() {
      async function createTodo(user,topic,tags,desc,cdate,ddate,board) {
            topic = topic === null || topic === undefined || topic.trim().length === 0 ? "Non-Topic" : topic
            user.todo.push(new Todo(topic,tags,desc,cdate,ddate,board))
            return await fetch(`http://localhost:3001/user/${user.id}`,{
                  method: "PUT",
                  headers:{
                        "Content-Type" : "application/json"
                  },
                  body: JSON.stringify(user)
            })

      }
      async function readTodo(userID = 0) {
            return await fetch(`http://localhost:3001/user/${userID}`)
            .then(resp => resp.json())
            .then(data => data.todo)
      }



      async function setTodoDone(user ,cdate){  

            const itemIndex = user.todo.findIndex((todo) =>  {
                  return new Date(todo.createdDate).getTime() == new Date(cdate).getTime()
            })
            console.log(itemIndex)
            user.todo[itemIndex].done = !user.todo[itemIndex].done
            if(user.todo[itemIndex].done){
                  user.todo[itemIndex].tags.push('Done')
            }else{
                  user.todo[itemIndex].tags = user.todo[itemIndex].tags.filter(tag => tag !== 'Done')
            }
            
            await fetch(`http://localhost:3001/user/${user.id}`,{
                  method: "PUT",
                  headers:{
                        "Content-Type" : "application/json"
                  },
                  body: JSON.stringify(user)
            })
      }
      async function removeTodoOnDeletedBoard(user , boardName){
            user.todo = user.todo.filter(todo => todo.board != boardName)
            await fetch(`http://localhost:3001/user/${user.id}`,{
                  method: "PUT",
                  headers:{
                        "Content-Type" : "application/json"
                  },
                  body: JSON.stringify(user)
            })
      }

      async function removeTodo(user , createdate) {
            user.todo = user.todo.filter(todo => new Date(todo.createdDate).getTime() != new Date(createdate).getTime())
            await fetch(`http://localhost:3001/user/${user.id}`,{
                  method: "PUT",
                  headers:{
                        "Content-Type" : "application/json"
                  },
                  body: JSON.stringify(user)
            })
      }

      function dateFormat(todoStorage){
            todoStorage.map(todo => {
                  todo.dueDate = new Date(todo.dueDate)
                  todo.createdDate = new Date(todo.createdDate)
                  return todo
            })
            
            return todoStorage
      }

      return { readTodo, setTodoDone, createTodo, removeTodo, dateFormat, removeTodoOnDeletedBoard }
}

export { todoManipulation }
