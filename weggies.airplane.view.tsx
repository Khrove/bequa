import {
    Stack,
    Heading, TextInput, Button, useComponentState, Textarea,
} from "@airplane/views";
import airplane from "airplane";

const WegmansDashboard = () => {
    const location = useComponentState("location");
    const groceryList = useComponentState("groceries");

    return (
        <Stack>
            <Heading>Weggies - Making grocery shopping simple one grocery list at a time</Heading>
            <Textarea id="groceries" label="Input your List of Groceries" defaultValue="List of groceries" required />
            <TextInput id="location" label="Location of the wegmans you are shopping at" defaultValue="Wegmans Location" required />
            <Button id="groceryBtn" task={{ slug: "weggies", params: { location: location.value, list: groceryList.value} }}>Create Grocery List</Button>
        </Stack>
)};

export default airplane.view(
    {
        slug: "benevolence",
        name: "Weggies",
    },
    WegmansDashboard,
);