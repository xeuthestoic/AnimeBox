async function compressImage(file){
  return new Promise(res => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas");
      const scale = 400 / img.width;
      c.width = 400;
      c.height = img.height * scale;
      const ctx = c.getContext("2d");
      ctx.drawImage(img,0,0,c.width,c.height);
      res(c.toDataURL("image/webp", 0.7));
    };
    img.src = URL.createObjectURL(file);
  });
}
