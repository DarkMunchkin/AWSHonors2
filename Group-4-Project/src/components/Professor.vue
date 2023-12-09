<template>
    <div class='professor'>
        <div class="navbar">
            <div class="welcome">
                <p>{{ 'Welcome ' + currentUser.nickname }}</p>
            </div>
            <div class="button">
                <button @click="logOut()" type="button">Log out</button>
            </div>
        </div> 
        <div class="prof-body">
            <ClassView :courses="userClasses"></ClassView>
        </div> 
    </div>
</template>

<script>
import ClassView from './ClassView.vue'

export default {
    data() {
        return {
            courses: []
        }
    },
    props:['currentUser', 'userClasses'],
    components: {
        ClassView
    },
    methods: {
        logOut() {
            this.$auth0.logout({ logoutParams: { returnTo: window.location.origin } });
            this.$emit('logOut')
        }
    }
}
</script>

<style>
.navbar{
    display: flex;
    align-items: baseline;
    background-color: #000080;
}
.welcome{
    color: white;
    font-size: 20px;
    text-align: center;
    padding: 10px 10px;
    text-decoration: none;
}
.button{
    margin-left: auto;
    color: white;
    text-align: center;
    padding: 14px 16px;
    text-decoration: none;
}
</style>