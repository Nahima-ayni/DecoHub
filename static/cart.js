const product = [
    {
      "id": 1,
      "name": "Dining Set",
      "description": "A sophisticated dining set featuring a dark wooden table and six high-back upholstered chairs.",
      "price": 21350,
      "image": "furniture/dining table/a1a172ae-06ff-488e-b5ca-9a52248d41d6.jpeg"
    },
    {
      "id": 2,
      "name": "Dining Set",
      "description": "A modern, oval-shaped dining table with a glass top and sleek, beige upholstered chairs.",
      "price": 57550,
      "image": "furniture/dining table/D2  (1).jpeg"
    },
    {
      "id": 3,
      "name": "Dining Set",
      "description": "A dining set with a glossy white table and dark grey chairs, accented by modern decor and unique lighting.",
      "price": 95550,
      "image": "furniture/dining table/D2  (2).jpeg"
    },
    {
      "id": 4,
      "name": "Dining Set",
      "description": "A dining room setup featuring a rectangular black table with white cushioned chairs. The black accent wall and modern lighting create a striking contrast, making this a standout piece for any home.",
      "price": 75950,
      "image": "furniture/dining table/D2  (3).jpeg"
    },
    {
      "id": 5,
      "name": "Dining Set",
      "description": "A mid-century modern inspired dining set with a light wooden table and white upholstered chairs. The warm wood paneling and artistic decor make this a cozy yet stylish choice for dining areas.",
      "price": 67850,
      "image": "furniture/dining table/D2  (4).jpeg"
    },
    {
      "id": 6,
      "name": "Dining Set",
      "description": "A minimalist dining set with a simple, rectangular table and beige upholstered chairs. The neutral color palette and elegant decor make it a versatile addition to any dining room.",
      "price": 49850,
      "image": "furniture/dining table/D2  (5).jpeg"
    },
    {
      "id": 7,
      "name": "Dining Set",
      "description": "A compact, round dining table with elegant white chairs, perfect for smaller spaces. The airy and light decor, combined with a cozy rug, creates a charming and inviting dining nook.",
      "price": 32140,
      "image": "furniture/dining table/D2  (7).jpeg"
    },
    {
      "id": 8,
      "name": "Dining Set",
      "description": "A modern dining set featuring a white rectangular table and sleek, white chairs. The contemporary decor and minimalist setup make it a stylish choice for any modern home.",
      "price": 25780,
      "image": "furniture/dining table/D2  (8).jpeg"
    },
    {
      "id": 9,
      "name": "Dining Set",
      "description": "A spacious dining set with a light wooden table and white upholstered chairs.",
      "price": 35500,
      "image": "furniture/dining table/D2  (9).jpeg"
    },
    {
      "id": 10,
      "name": "Dining Set",
      "description": "A sleek dining set with a light wooden table and chic, green velvet chairs.",
      "price": 25870,
      "image": "furniture/dining table/D2  (10).jpeg"
    },
    {
      "id": 11,
      "name": "Dining Set",
      "description": "A luxurious dining set with a marble-topped table and plush, beige chairs.",
      "price": 55850,
      "image": "furniture/dining table/D2  (11).jpeg"
    },
    {
      "id": 12,
      "name": "Dining Set",
      "description": "An elegant dining set with a white rectangular table and matching upholstered chairs.",
      "price": 15850,
      "image": "furniture/dining table/DT 1.jpeg"
    },
    {
      "id": 13,
      "name": "Dining Set",
      "description": "A vibrant dining set featuring a rectangular table with a mix of pink and green velvet chairs.",
      "price": 45850,
      "image": "furniture/dining table/e1a00fdf-0c0d-4f41-8601-90a54c671a94.jpeg"
    }
  ]
  const categories = [...new Set(product.map((item)=>
      {return item}))]
      let i=0;
  document.getElementById('root').innerHTML = categories.map((item)=>
  {
      var {image, title, price} = item;
      return(
          `<div class='box'>
              <div class='img-box'>
                  <img class='images' src=${image}></img>
              </div>
          <div class='bottom'>
          <p>${title}</p>
          <h2>$ ${price}.00</h2>`+
          "<button onclick='addtocart("+(i++)+")'>Add to cart</button>"+
          `</div>
          </div>`
      )
  }).join('')
  
  var cart =[];
  
  function addtocart(a){
      cart.push({...categories[a]});
      displaycart();
  }
  function delElement(a){
      cart.splice(a, 1);
      displaycart();
  }
  
  function displaycart(){
      let j = 0, total=0;
      document.getElementById("count").innerHTML=cart.length;
      if(cart.length==0){
          document.getElementById('cartItem').innerHTML = "Your cart is empty";
          document.getElementById("total").innerHTML = "$ "+0+".00";
      }
      else{
          document.getElementById("cartItem").innerHTML = cart.map((items)=>
          {
              var {image, title, price} = items;
              total=total+price;
              document.getElementById("total").innerHTML = "$ "+total+".00";
              return(
                  `<div class='cart-item'>
                  <div class='row-img'>
                      <img class='rowimg' src=${image}>
                  </div>
                  <p style='font-size:12px;'>${title}</p>
                  <h2 style='font-size: 15px;'>$ ${price}.00</h2>`+
                  "<i class='fa-solid fa-trash' onclick='delElement("+ (j++) +")'></i></div>"
              );
          }).join('');
      }
  }