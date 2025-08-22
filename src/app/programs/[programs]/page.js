import { courses } from '../../../data/programs'
import CourseLayout from '../../../components/Pages/Programs/CourseLayout'
import { notFound } from 'next/navigation'

export default async function CoursePage({ params }) {
  const { programs } = await params;
  const course = courses[programs]

  if (!course) {
    notFound()
  }

  return <CourseLayout course={course} />
}

export async function generateStaticParams() {
  return Object.keys(courses).map((courseId) => ({
    courseId: courseId,
  }))
}