import {
    Stack,
    Heading, TextInput, Button, useComponentState, Textarea, Table, Loader, Callout, Text, useTaskMutation
} from "@airplane/views";
import airplane from "airplane";

const WegmansDashboard = () => {
    const location = useComponentState("location");
    const groceryList = useComponentState("groceries");

    const { mutate, output, loading, error } = useTaskMutation({
        slug: "weggies",
        params: { location: location.value, list: groceryList.value },
    });
    if (loading) return (
        <Stack>
            <Heading>Creating your grocery list 😘</Heading>
            <Loader variant="bars" />
        </Stack>
    );
    if (error) return <Callout variant="error">{error.message}</Callout>
    const items = output?.map((item) => ({ product: item.productTitle, aisle: item.aisle, price: item.price }));

    return (
        <Stack>
            <Stack>
                <Heading>Weggies - Making grocery shopping simple one grocery list at a time</Heading>
                <Textarea id="groceries" label="Input your List of Groceries" defaultValue="List of groceries" required />
                <TextInput id="location" label="Location of the wegmans you are shopping at" defaultValue="Wegmans Location" required />
                <Button id="groceryBtn" onClick={() => { mutate(); }}>Create Grocery List</Button>
            </Stack>
            <Stack>
                {items?.length > 0 ? (
                    <Table id="groceryList" title="Grocery List" enableCSVDownload="true" data={items} />
                ) : (
                    <Text>No Grocery Items 😔</Text>
                )}

            </Stack>
        </Stack>
)};

export default airplane.view(
    {
        slug: "benevolence",
        name: "Weggies",
    },
    WegmansDashboard,
);