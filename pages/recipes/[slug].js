import Image from 'next/image'
import { createClient } from 'contentful';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
const client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_ACCESS_KEY,
  });

export async function getStaticPaths(){
const res = await client.getEntries({ content_type: 'recipe' })

const paths = res.items.map((item)=>{
  return  {
    params:{slug:item.fields.slug}
  }
})
  return {
    paths,
    fallback:false
  }
}

 
export async function getStaticProps({params}){
  
const {items} = await client.getEntries({
   content_type: 'recipe',
   "fields.slug":params.slug
   })

  return {
    props:{recipe:items[0]}
  }
}

 


export default function RecipeDetails({recipe}) {
  console.log(recipe);
  const {cookingTime,featuredImage,ingredients,method, title} = recipe.fields;
  return (
    <div className="main">
      <div className="banner">
     <Image src={'https:'+featuredImage.fields.file.url} 
     width={1200}
     height={400}
     />
     <h2>{title}</h2>
      </div>

      <div className="info">
        <p>Take about {cookingTime} mins to cook.</p>
        <h3>Ingredients:</h3>
        {ingredients.map((ing)=>(
          <span key={ing}>{ing}</span>
        ))}
      </div>

      <div className="method">
        <h3>Method:</h3>
        <div>{documentToReactComponents(method)}</div>
      </div>
 <style jsx>{`

        .main{
          margin:0px 100px
        }
        h2,h3 {
          text-transform: uppercase;
        }
         
        .banner h2 {
          margin: 0;
          background: #fff;
          display: inline-block;
          padding: 20px;
          position: relative;
          top: -60px;
          left: -10px;
          // transform: rotateZ(-1deg);
          box-shadow: 1px 3px 5px rgba(0,0,0,0.1);
        }
        .info p {
          margin: 0;
        }
        .info span::after {
          content: ", ";
        }
        .info span:last-child::after {
          content: ".";
        }
      `}</style>
    </div>
  )
}