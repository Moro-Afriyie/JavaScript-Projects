class NotesStore {
    //add your code 
    constructor() {
        this.notesArr = [];
        this.notes = [];
    }
    addNote = (state, name) => {
        const states = ['completed', 'active', 'others'];
        //const notesArr = [];
        if (name == '') {

            console.log('error')
        } else if (name != '' && !states.includes(state)) {
            console.log('error');
        } else {
            this.notesArr.push([state, name]);
        }
        console.log(this.notesArr);


    }
    getNote = (state) => {
        this.notesArr.forEach(el => {
            if (el[0] === state) this.notes.push(el[1])
        })
        console.log(this.notes);
    }

}

const r = new NotesStore();
r.addNote('active', '');
r.addNote('foo', 'drink');
r.addNote('active', 'pen');
// r.addNote('active', 'pen');
r.getNote('active');