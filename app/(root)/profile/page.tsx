import Collection from "@/components/shared/Collection"
import { Button } from "@/components/ui/button"
import { getEventsByUser } from "@/lib/actions/event.actions"
import { getOrdersByUser } from "@/lib/actions/order.actions"
import { IOrder } from "@/lib/database/models/order.model"
import { SearchParamProps } from "@/types"
import { auth } from "@clerk/nextjs"
import Link from "next/link"

const page = async({searchParams}:SearchParamProps) => {

  const ordersPage=Number(searchParams?.orderPage)||1;
  const eventsPage=Number(searchParams?.orderPage)||1;

  const {sessionClaims}=auth();
  const userId=sessionClaims?.userId as string;
  const orders=await getOrdersByUser({userId,page:ordersPage});
  const orderedEvents =orders?.data.map((order:IOrder)=>order.event)||[];
  const OrganizedEvents=await getEventsByUser({userId,page:eventsPage});
  return (
    <>
      {/*MY TICKETS*/ }
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <div className="wrapper flex items-center justify-center sm:justify-between">
          <h3 className="h3-bold text-center sm:text-left">My Tickets</h3>
          <Button asChild size='lg' className="button hidden sm:flex">
            <Link href='/#events'>Explore More Events</Link>
          </Button>
        </div>
      </section>
      <section className="wrapper my-8">
      <Collection
          data={orderedEvents}
          emptyTitle="No event tickets purchased yet"
          emptyStateSubtext="No worries - plenty of exciting events to explore!"
          collectionType="My_Tickets"
          limit={3}
          page={ordersPage}
          urlParamName="orderPage"
          totalPages={orders?.totalPages}
          />
      </section>
      {/* Event Organized */}
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <div className="wrapper flex items-center justify-center sm:justify-between">
          <h3 className="h3-bold text-center sm:text-left">Events Organized</h3>
          <Button asChild size='lg' className="button hidden sm:flex">
            <Link href='/events/create'>Create new events</Link>
          </Button>
        </div>
      </section>
      <section className="wrapper my-8">
      <Collection
          data={OrganizedEvents?.data}
          emptyTitle="No event have been created yet"
          emptyStateSubtext="Go create some now"
          collectionType="Events_Organized"
          limit={3}
          page={eventsPage}
          urlParamName="eventsPage"
          totalPages={OrganizedEvents?.totalPages}
          />
      </section>
    </>
  )
}

export default page