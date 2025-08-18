import { courses } from '../../../data/courses'
import CourseLayout from '../../../components/Pages/Programs/CourseLayout'
import { notFound } from 'next/navigation'

export default async function CoursePage({ params }) {
   const { courseId } = await params;
  const course = courses[courseId]

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