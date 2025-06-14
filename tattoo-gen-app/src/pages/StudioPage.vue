<template>
  <v-container fluid>
    <v-row>
      <!-- Left Column -->
      <v-col cols="12" md="6">
        <h2 class="text-h5 font-weight-bold mb-4">Generate Tattoo</h2>

        <v-text-field
          v-model="prompt"
          label="Prompt"
          placeholder="e.g. skull and roses"
          variant="outlined"
          class="mb-4"
        />

        <v-select
          v-model="bodyPart"
          :items="bodyParts"
          label="Placement"
          variant="outlined"
          class="mb-4"
        />

        <v-btn
            color="primary"
            class="mb-6"
            @click="generateTattoo"
            :loading="isLoading"
            :disabled="isLoading"
        >
          Generate Tattoo
        </v-btn>

        <!-- Canvas Box -->
        <v-sheet
          class="bg-grey-lighten-4 mb-6"
          height="200"
          rounded
          elevation="1"
        >
            <div class="d-flex justify-center align-center h-100">
                <v-img v-if="tattooImageUrl" :src="tattooImageUrl" />
                <p v-if="tattooImageUrl">URL: <a :href="tattooImageUrl" target="_blank">{{ tattooImageUrl }}</a></p>
                <p v-else class="text-center">[ UV Canvas Preview Placeholder ]</p>
            </div>
        </v-sheet>

        <!-- Layer Manager -->
        <v-card variant="tonal" elevation="0">
          <v-card-title>Tattoo Layers</v-card-title>
          <v-card-text>
            <p class="text-grey">No layers yet.</p>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Right Column -->
      <v-col cols="12" md="6">
        <h2 class="text-h5 font-weight-bold mb-4">Live Preview</h2>
        <v-sheet
          class="bg-grey-lighten-3"
          height="400"
          rounded
          elevation="1"
        >
          <p class="text-center py-16">[ Mannequin Preview Placeholder ]</p>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { generateTattooImage } from '../api/generateTattoo'

const isLoading = ref(false)
const prompt = ref('')
const bodyPart = ref('Upper Arm')
const bodyParts = ['Upper Arm', 'Forearm', 'Upper Back', 'Thigh', 'Chest']
const tattooImageUrl = ref(null)

const generateTattoo = async () => {
  try {
    isLoading.value = true
    const url = await generateTattooImage(prompt.value)
    console.log("🎯 Full image URL result:", url)
    console.log("🧪 Type:", typeof url)
    console.log("🧾 Is string:", typeof url === 'string')
    tattooImageUrl.value = url
  } catch (err) {
    console.error(err)
    alert('Failed to generate tattoo')
  } finally {
    isLoading.value = false
  }
}

</script>
