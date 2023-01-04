<template>
  <div>
    <button @click="getData">Get Data</button>
    <p>{{ data }}</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      data: null
    };
  },
  methods: {
    async getData() {
      try {
        const response = await axios.get('http://localhost:3000/metacultivation');
        this.data = response.data;
      } catch (error) {
        console.error(error);
      }
    }
  }
};
</script>
