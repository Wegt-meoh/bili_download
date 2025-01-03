const mediaUrlList = [
    'https://xxxxxxxxxxxxxxxxx.com',
    'https://xxxxxxxxxxxxxxx1.com'
]

for (let url of mediaUrlList) {
    const res = await fetch(url)
    const dataBlob = await res.blob()
    const dataUrl = URL.createObjectURL(dataBlob);

    console.log(dataUrl)
}