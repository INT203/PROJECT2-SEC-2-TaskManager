class Todo {
    constructor(topic, tags, description, createdDate, dueDate = "none", board) {
        this.id = createdDate;
        this.topic = topic;
        this.tags = tags;
        this.description = description;
        this.createdDate = createdDate;
        this.dueDate = dueDate;
        this.board = board
        this.done = false
    }
    setDone(value){
        this.done = value
    }
    getInfo(){
        return {
            topic: this.topic,
            tag: this.tag,
            description: this.description,
            createdDate: this.createdDate,
            dueDate: this.dueDate,
            board: this.board,
            done : this.done
        }
    }
}

export { Todo }
// module.exports = Todo