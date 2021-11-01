import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import remark from 'remark'
import html from 'remark-html'

// process.cwd() 현재 작업 디렉토리
const postsDirectory = path.join(process.cwd(), 'posts')

export function getSortedPostsData() { // 블로그 게시글  목록 받아오기
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory)
  const allPostsData = fileNames.map(fileName => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md$/, '')

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName) // 파일 위치
    const fileContents = fs.readFileSync(fullPath, 'utf8') // 파일 읽기

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents)
    console.log('💗💓💓💞💕', matterResult)



    
    // Combine the data with the id
    const results = {
      id,
      ...matterResult.data
    }

    // console.log('🔯🕎☯☦🛐⛎♈', results)
    /*
     * {
     *   id: 'pre-rendering',
     *   title: 'Two Forms of Pre-rendering',
     *   date: '2020-01-01'
     * }
     * {
     *   id: 'ssg-ssr copy',
     *   title: 'When to Use Static Generation v.s. Server-side Rendering',
     *   date: '2020-01-02'
     * }
     * {
     *   id: 'ssg-ssr',
     *   title: 'When to Use Static Generation v.s. Server-side Rendering',
     *   date: '2020-01-02'
     * }
    */
    return results
  })
  // Sort posts by date
  // console.log('❣💌💢💢✝☮🕳💝💔❣💚💙💜🤎💗', allPostsData)

  /**
   * allPostsData
   * [
   *   {
   *     id: 'pre-rendering',
   *     title: 'Two Forms of Pre-rendering',
   *     date: '2020-01-01'
   *   },
   *   {
   *     id: 'ssg-ssr copy',
   *     title: 'When to Use Static Generation v.s. Server-side Rendering',
   *     date: '2020-01-02'
   *   },
   *   {
   *     id: 'ssg-ssr',
   *     title: 'When to Use Static Generation v.s. Server-side Rendering',
   *     date: '2020-01-02'
   *   }
   * ]
   */
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1
    } else {
      return -1
    }
  })
}

export function getAllPostIds() { // 모든 게시글의 아이디(파일이름) 배열로 받아오기. -> 얘네가 경로가 되어준다. 
  const fileNames = fs.readdirSync(postsDirectory)
  return fileNames.map(fileName => {
    return {
      params: {
        id: fileName.replace(/\.md$/, '')
      }
    }
  })
}

export async function getPostData(id) { // 게시글 실제 내용 읽어오기
  const fullPath = path.join(postsDirectory, `${id}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents)

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content)
  const contentHtml = processedContent.toString()

  // Combine the data with the id and contentHtml
  return {
    id,
    contentHtml,
    ...matterResult.data
  }
}


/*
{
!  content: '\n' +
    'We recommend using **Static Gen  \n' +
    '\n' +
    '\n' +
    '\n' +
    '\n' +
    'eration** (with and without data) whenever possible because your page can 
be built once and served by CDN, which makes it much faster than having a server render the page on every request.\n' +
    '\n' +
    'You can use Static Generation for many types of pages, including:\n' +    
    '\n' +
    '- Marketing pages\n' +
    '- Blog posts\n' +
    '- E-commerce product listings\n' +
    '- Help and documentation\n' +
    '\n' +
    `You should ask yourself: "Can I pre-render this page **ahead** of a user's request?" If the answer is yes, then you should choose Static Generation.\n` +    '\n' +
    "On the other hand, Static Generation is **not** a good idea if you cannot 
pre-render a page ahead of a user's request. Maybe your page shows frequently updated data, and the page content changes on every request.\n" +
    '\n' +
    'In that case, you can use **Server-Side Rendering**. It will be slower, but the pre-rendered page will always be up-to-date. Or you can skip pre-rendering and use client-side JavaScript to populate data.',
!  data: {
    title: 'When to Use Static Generation v.s. Server-side Rendering',
    date: '2020-01-02'
  },
  isEmpty: false,
  excerpt: '',
  orig: <Buffer 2d 2d 2d 0a 74 69 74 6c 65 3a 20 22 57 68 65 6e 20 74 6f 20 55 
73 65 20 53 74 61 74 69 63 20 47 65 6e 65 72 61 74 69 6f 6e 20 76 2e 73 2e 20 53 65 72 ... 993 more bytes>
}


*/