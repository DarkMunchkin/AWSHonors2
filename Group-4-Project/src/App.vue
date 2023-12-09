<template>
    <Login :class="{hide: currentScreen!='Login'}" @changeScreen="changeScreen($event)"></Login>
    <Student 
        :class="{hide: currentScreen!='Student'}" 
        :user-Classes="userClasses"
        :current-user="currentUser" 
        :subjects="subjects"
        :data="data"
        :credits="credits"
        @removeClass="removeClass($event)"
        @credits="updateCredits($event)"
        @logOut="logOut()">
    </Student>   
    <Professor 
        :class="{hide: currentScreen!='Professor'}" 
        :current-user="currentUser" 
        :user-Classes="userClasses"
        @logOut="logOut()">
    </Professor> 
    <Admin 
        :class="{hide: currentScreen!='Admin'}" 
        :current-user="currentUser" 
        :subjects="subjects"
        @logOut="logOut()">
    </Admin> 
</template>

<script>
import Login from './components/Login.vue'
import Student from './components/Student.vue'
import Professor from './components/Professor.vue'
import Admin from './components/Admin.vue'

export default {
    data() {
        return {
            subjectBool: true,
            currentUser: '',
            currentScreen: 'Login',
            screens: ['Login', 'Student', 'Professor', 'Admin'],
            backgroundColors: ['#000080', 'white'],
            columns: ['Subject', 'Class ID', 'Name', 'Number', 'Professor', 'Credits', 'Mon', 'Tue', 'Wed', 'Thr', 'Fri'],
            userClasses: [],
            newClass: '',
            subjects: ['Select a Subject'],
            data: {},
            credits: 0
        }
    },
    components: {
        Login,
        Student,
        Professor,
        Admin
    },
    methods: {
        changeScreen(data) {
            this.currentScreen = data.group
            this.currentUser = data.user
            this.getClasses(data.data)
            this.credits = data.data.credits
            document.body.style.backgroundColor = this.backgroundColors[1]
            if ((data.group == 'Admin' || data.group == 'Student') && this.subjectBool == true) {
                this.subjectBool = false
                this.getSubjects()
            }
        },
        updateCredits(num) {
            console.log(typeof num)
            this.credits = parseInt(this.credits) + parseInt(num)
        },
        async getSubjects() {
            const response = await fetch('https://yhw30hsvu5.execute-api.us-east-1.amazonaws.com/classes/dynamodbmanager?subject=Subjects')
            const subjectSet = await response.json()
            const tempSubjects = subjectSet.Items[0].subjects.SS
            this.subjects = tempSubjects.filter(subject => subject !== 'Select a Subject')
            this.subjects.unshift('Select a Subject')
        },
        logOut() {
            this.currentScreen = 'Login'
            document.body.style.backgroundColor = this.backgroundColors[0]
        },
        async removeClass(ClassId) {
            this.userClasses = this.userClasses.filter(classObj => classObj['Class ID'] !== ClassId)
            let data = {}
            if(this.userClasses.length === 0) {
                const id = this.currentUser.sub.split("|")[1]
                this.credits = 0
                data = {
                        "authId": id,
                        "type": 'Student',
                        "credits": "0",
                        "num_classes": "0",
                        "classes": ["No Classes"]
                    }
            }
            else {
                let credits = 0
                let classes = []
                const id = this.currentUser.sub.split("|")[1]
                for(let i = 0; i < this.userClasses.length; i++) {
                    credits += parseInt(this.userClasses[i].Credits)
                    const subjectId = "" + this.userClasses[i].Subject + "|" + this.userClasses[i]['Class ID'] + ""
                    classes.push(subjectId)
                }
                this.credits = credits
                data = {
                    "authId": id,
                    "num_classes": this.userClasses.length.toString(),
                    "credits": credits.toString(),
                    "classes": classes
                }
            }
            const url = "https://bsp4pnlfai.execute-api.us-east-1.amazonaws.com/Prod/users"
            let response = await fetch(url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            })
        },
        async getClasses(data) {
            let classes = []
            for(let i = 0; i < parseInt(data.num_classes); i++) {
                let userClass = data.classes[i]
                if(userClass != "No Classes") {
                    let subject = userClass.split('|')[0]
                    let id = userClass.split('|')[1]
                    const url = 'https://yhw30hsvu5.execute-api.us-east-1.amazonaws.com/classes/class?subject=' + subject + '&id=' + id
                    const response = await fetch(url)
                    let data = await response.json()
                    const newClass = {
                        'Subject': data.Items[0].Subject.S,
                        'Class ID': data.Items[0].ClassId.S,
                        'Name': data.Items[0].name.S,
                        'Number': data.Items[0].number.S,
                        'Professor': data.Items[0].professor.S,
                        'Credits': data.Items[0].credits.S,
                        'Mon': data.Items[0].mon.S,
                        'Tue': data.Items[0].tue.S,
                        'Wed': data.Items[0].wed.S,
                        'Thr': data.Items[0].thr.S,
                        'Fri': data.Items[0].fri.S
                    }
                    this.userClasses.push(newClass)
                }
            }
        }
    }
}
</script>

<style>
body{
    background-color: #000080;
}
.login{
    background-color: white;
    width: 473px;
    height: 350px;
    margin: 75px auto;
    text-align: center;
}
.login.hide{
    display: none;
}
.student.hide{
    display: none;
}
.professor.hide{
    display: none;
}
.admin.hide{
    display: none;
}
</style>