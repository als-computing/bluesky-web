import { ComponentViewerExampleReal } from "@blueskyproject/finch";
export default function ComponentsPage() {
    //display a bunch of components that can be tested against the docker compose that includes the caproto server

    return (
        <div className="h-full w-full overflow-auto">
            <ComponentViewerExampleReal />

        </div>
    )
}