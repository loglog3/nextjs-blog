import Layout from '../../components/layout'
import { getAllPostIds, getPostData } from '../../lib/posts'
import Head from 'next/head'
import Date from '../../components/date'
import utilStyles from '../../styles/utils.module.css'

export default function Post({ postData }) {
  return (
    
    <Layout>  {/* layout.js에서 레이아웃을 정해두었다. */}
      <Head>
        {/* 페이지별 <head>의 메타테그인 <title>을 이와같은 형식으로 바꿀 수 있다. */}
        <title>{postData.title}</title>
      </Head>
      <article>
        <h1 className={utilStyles.headingXl}>{postData.title}</h1>
        <div className={utilStyles.lightText}>
          <Date dateString={postData.date} />
        </div>
        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
        {/* innerHTML 설정해주는 것과 완전히 같다.  */}
        {/* https://ko.reactjs.org/docs/dom-elements.html */}
      </article>
    </Layout>
  )
}

export async function getStaticPaths() { // 얘의 용도를 모르겠네 -> 특정한 경로가 있다..! 라는 것을 알려주기 위함이다.
  // pre-rendering 이라는 경로는 멀쩡한 경로라고 알려주는 것.
  // 항상 rednering을 할 수 없으니, 어떤 param에 따라 렌더링을 시도할지말지 정하기 위해 넣어주는 배열이다. 
  const paths = getAllPostIds() // 배열
  console.log("🚼🅰🅱🆎🆑🅾", paths)
  // [
  //   { params: { id: 'pre-rendering' } },     
  //   { params: { id: 'ssg-ssr copy' } }       
  // ]
  return {
    paths,
    fallback: false
  }
}

export async function getStaticProps({ params }) {
  //  params.id로 들어온다.얘를 가지고 파일을 찾아서 읽는다. 
  const postData = await getPostData(params.id)
  // 읽은 HTML String으로 변환되었다. postData를 그럼 부모한테 실제 페이지에 props로 전달해주게 된다.
  return {
    props: {
      postData
    }
  }
}
