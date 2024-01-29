// DocumentViewer.vue
<template>
	<div>
		<vue-pdf-app style="height: 100vh;" :pdf="actual_file" theme="light" :config="config"></vue-pdf-app>
		<ThumbnailsViewer :thumbnails="thumbnails" />
		<!-- <img :src="thumbnail" alt="Thumbnail" style="max-width: 100px; max-height: 200px; margin: 10px;" /> -->
	</div>
</template>

<script>
import VuePdfApp from 'vue3-pdf-app';
// import ThumbnailsViewer from '@/components/ThumbnailsViewer';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
// import "vue3-pdf-app/dist/icons/main.css";

export default {
	props: {
		actual_file: String,
	},
	components: {
		VuePdfApp,
		// ThumbnailsViewer,
	},

	computed: {
		// thumbnails() {
		// 	return this.$store.state.thumbnails;
		// },
	},
	data() {
		return {
			baseUrl: this.baseApiUrl,
			token: localStorage.getItem("edms_token"),
			config: {
				toolbar: {
					toolbarViewerLeft: {
						previous: true
					}
				},
				title: "true"
			},
			thumbnails: [],
		}
	},
	mounted() {
		this.parseFile();
		// this.generateThumbnails();
	},
	methods: {
		// async loadPDF(event) {
		// 	try {
		// 		const file = event.target.files[0];
		// 		if (!file) throw new Error('No file selected');

		// 		const arrayBuffer = await this.readFileAsync(file);
		// 		this.parliament = arrayBuffer;

		// 		this.generateThumbnails(arrayBuffer);
		// 	} catch (error) {
		// 		console.error('Error loading PDF:', error);
		// 	}
		// },

		// async generateThumbnails(pdfArrayBuffer) {
		// 	try {
		// 		const pdfDoc = await pdfjsLib
		// 			.getDocument({ data: new Uint8Array(pdfArrayBuffer) })
		// 			.promise;
		// 		const numPages = pdfDoc.numPages;
		// 		const thumbnails = [];

		// 		for (let i = 1; i <= numPages; i++) {
		// 			const page = await pdfDoc.getPage(i);
		// 			const viewport = page.getViewport({ scale: 0.1 });
		// 			const canvas = document.createElement('canvas');
		// 			const context = canvas.getContext('2d');

		// 			canvas.width = viewport.width;
		// 			canvas.height = viewport.height;

		// 			const renderContext = { canvasContext: context, viewport: viewport };
		// 			await page.render(renderContext).promise;

		// 			const dataUrl = canvas.toDataURL('image/png');
		// 			thumbnails.push(dataUrl);
		// 			this.thumbnail = dataUrl;
		// 		}

		// 		this.$store.commit('setThumbnails', thumbnails);
		// 	} catch (error) {
		// 		console.error('Error generating thumbnails:', error);
		// 	}
		// },

		// async readFileAsync(file) {
		// 	return new Promise((resolve, reject) => {
		// 		const reader = new FileReader();

		// 		reader.onload = () => resolve(reader.result);
		// 		reader.onerror = (error) => reject(error);

		// 		reader.readAsArrayBuffer(file);
		// 	});
		// },
		async parseFile(document) {
			try {
				const fetchResponse = await fetch(
					"http://127.0.0.1:8000/api/showPdf/1706242914_2.1.pdf", {
					// this.baseUrl +"/"+ this.$props.actual_file, {
					method: 'GET',
					headers: {
						'Authorization': `Bearer ${this.token}`,
						'Content-Type': 'application/json',
						'Access-Control-Allow-Origin': '*',
						'Access-Control-Allow-Methods': 'GET,POST,PATCH,OPTIONS'
					}
				}
				);
				// Get the PDF file as an ArrayBuffer
				const pdfArrayBuffer = await fetchResponse.arrayBuffer();
				const pdfDoc = await pdfjsLib
					.getDocument({ data: new Uint8Array(pdfArrayBuffer) })
					.promise;
				const numPages = pdfDoc.numPages;
				this.thumbnails = [];

				for (let i = 1; i <= numPages; i++) {
					const page = await pdfDoc.getPage(i);
					const viewport = page.getViewport({ scale: 0.1 });
					const canvas = document.createElement('canvas');
					const context = canvas.getContext('2d');

					canvas.width = viewport.width;
					canvas.height = viewport.height;

					const renderContext = { canvasContext: context, viewport: viewport };
					await page.render(renderContext).promise;

					const dataUrl = canvas.toDataURL('image/png');
					this.thumbnails.push(dataUrl);
					// this.thumbnail = dataUrl;
				}
				} catch (ex) {
					console.log("Error in fetch");
					console.log(ex);
				}
			}
	},
	};
</script>

<style scoped></style>
