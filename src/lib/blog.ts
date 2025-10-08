import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const getPostsDirectory = (locale: string = 'ko') => {
  const baseDir = path.join(process.cwd(), 'content/blog');
  if (locale === 'en') return path.join(baseDir, 'en');
  if (locale === 'ja') return path.join(baseDir, 'ja');
  if (locale === 'es') return path.join(baseDir, 'es');
  if (locale === 'pt') return path.join(baseDir, 'pt');
  if (locale === 'de') return path.join(baseDir, 'de');
  if (locale === 'fr') return path.join(baseDir, 'fr');
  return baseDir;
};

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  category: string;
  date: string;
  readTime: string;
  author: string;
  content: string;
  excerpt: string;
}

export interface BlogPostMeta {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  category: string;
  date: string;
  readTime: string;
  author: string;
  excerpt: string;
}

export async function getAllPosts(locale: string = 'ko'): Promise<BlogPostMeta[]> {
  // locale에 따른 디렉토리에서 모든 .md 파일 읽기
  const postsDirectory = getPostsDirectory(locale);
  
  // 디렉토리가 존재하지 않으면 빈 배열 반환
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }
  
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = await Promise.all(
    fileNames
      .filter((fileName) => fileName.endsWith('.md'))
      .map(async (fileName) => {
        const slug = fileName.replace(/\.md$/, '');
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        
        // frontmatter 파싱
        const { data, content } = matter(fileContents);
        
        // 첫 번째 문단을 excerpt로 추출
        const excerpt = content
          .split('\n\n')[1] // 첫 번째 헤딩 다음 문단
          ?.replace(/^#+\s+/, '') // 헤딩 마크다운 제거
          ?.slice(0, 150) + '...' || '';

        return {
          slug,
          title: data.title,
          description: data.description,
          keywords: data.keywords || [],
          category: data.category,
          date: data.date,
          readTime: data.readTime,
          author: data.author,
          excerpt
        };
      })
  );

  // 날짜 순으로 정렬 (최신순)
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export async function getPostBySlug(slug: string, locale: string = 'ko'): Promise<BlogPost | null> {
  try {
    const postsDirectory = getPostsDirectory(locale);
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    
    // frontmatter와 content 분리
    const { data, content } = matter(fileContents);
    
    // Markdown을 HTML로 변환
    const processedContent = await remark()
      .use(html, { sanitize: false })
      .process(content);
    const contentHtml = processedContent.toString();
    
    // excerpt 생성
    const excerpt = content
      .split('\n\n')[1]
      ?.replace(/^#+\s+/, '')
      ?.slice(0, 150) + '...' || '';

    return {
      slug,
      title: data.title,
      description: data.description,
      keywords: data.keywords || [],
      category: data.category,
      date: data.date,
      readTime: data.readTime,
      author: data.author,
      content: contentHtml,
      excerpt
    };
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error);
    return null;
  }
}

export async function getAllSlugs(locale: string = 'ko'): Promise<string[]> {
  const postsDirectory = getPostsDirectory(locale);
  
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }
  
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => fileName.replace(/\.md$/, ''));
}

export function getCategories(locale: string = 'ko'): string[] {
  if (locale === 'en') {
    return ['Science', 'Genetics', 'Tips'];
  }
  if (locale === 'ja') {
    return ['科学', '遺伝学', 'ヒント'];
  }
  if (locale === 'es') {
    return ['Ciencia', 'Genética', 'Consejos'];
  }
  if (locale === 'pt') {
    return ['Ciência', 'Genética', 'Dicas'];
  }
  if (locale === 'de') {
    return ['Wissenschaft', 'Genetik', 'Tipps'];
  }
  if (locale === 'fr') {
    return ['Science', 'Génétique', 'Conseils'];
  }
  return ['과학 원리', '유전학 지식', '사용 팁'];
}

export async function getPostsByCategory(category: string, locale: string = 'ko'): Promise<BlogPostMeta[]> {
  const allPosts = await getAllPosts(locale);
  return allPosts.filter(post => post.category === category);
}

export async function getRelatedPosts(slug: string, category: string, locale: string = 'ko', limit = 2): Promise<BlogPostMeta[]> {
  const allPosts = await getAllPosts(locale);
  return allPosts
    .filter(post => post.slug !== slug && post.category === category)
    .slice(0, limit);
}