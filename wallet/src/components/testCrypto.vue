<template>
    <div>
        <h1>{{ message }}</h1>
    </div>
</template>
  
<script>
import { Mkey } from '../Mkey.js';

export default {
    name: 'App',
    data() {
        return {
            message: '',
        };
    },
    created() {
        const myMkey = new Mkey();
        console.log(myMkey); // check the object in the console
        this.message = 'Mkey object created successfully!';
    },
};
</script>