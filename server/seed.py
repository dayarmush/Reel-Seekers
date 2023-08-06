from config import session, db
from app import app
from models.favorite import Favorite
# from models.edit import Edit
from models.fish import Fish
from models.lake import Lake
from models.message import Message
from models.review import Review
from models.user import User
from models.lake_fish import FishLake
from faker import Faker
from random import choice  as rc, randint

fake = Faker()

fish_list = [
    "Bass", "Trout", "Salmon",
    "Pike", "Catfish", "Perch",
    "Walleye", "Snook", "Redfish",
    "Bluegill", "Crappie", "Muskie",
    "Rainbow Trout", "Brook Trout",
    "Arctic Char", "Chinook Salmon",
    "Coho Salmon", "Sockeye Salmon",
    "Largemouth Bass", "Smallmouth Bass", "Spotted Bass",
    "Peacock Bass", "White Bass", "Yellow Bass",
    "Chain Pickerel", "Northern Pike", "Muskellunge",
    "Blue Catfish", "Flathead Catfish", "Channel Catfish",
    "Yellow Bullhead", "Black Bullhead", "Brown Bullhead",
    "Yellow Perch", "White Perch", "European Perch",
    "Yellow Walleye", "Blue Walleye", "Silver Walleye",
    "Common Snook", "Fat Snook", "Tarpon Snook",
    "Red Drum", "Black Drum", "Spotted Drum",
    "Longear Sunfish", "Redear Sunfish", "Green Sunfish",
    "White Crappie", "Black Crappie", "Yellow Crappie",
    "Tiger Muskie", "Chain Muskie",
    "Striped Bass",
    "Kokanee Salmon", "Steelhead Trout", "Cutthroat Trout",
    "Dolly Varden Trout", "Brown Trout",
    "Lake Trout",
    "Grayling Trout", "Bull Trout", "Landlocked Salmon",
    "Atlantic Salmon", "Pink Salmon", "Chum Salmon",
    "King Salmon",
    "Sauger", "European Zander",
    "Speckled Crappie",
    "Pumpkinseed Sunfish", "Warmouth Sunfish",
    "Balkhash Perch", "Blue Bullhead",
    "Giant Snakehead", "Arapaima",
    "Barramundi", "Siamese Carp", "Goatfish",
    "Swordfish", "Marlin", "Bluefin Tuna",
    "Yellowfin Tuna", "Albacore Tuna", "Skipjack Tuna",
    "Bigeye Tuna", "Blackfin Tuna", "Bonito Tuna",
    "Dorado", "Mahi Mahi", "Wahoo",
    "Roosterfish", "Sailfish", "Tarpon",
    "Bonefish", "Triggerfish", "Grouper",
    "Snapper", "Amberjack", "Cobia",
    "Bluefish", "Striped Bass", "Redfish",
    "Kingfish", "Mackerel", "Shark"
]

lakes = [
    "Lake Superior", "Lake Michigan", "Lake Huron",
    "Lake Erie", "Lake Ontario", "Great Salt Lake",
    "Lake Okeechobee", "Lake Pontchartrain", "Lake Champlain",
    "Lake Powell", "Lake Mead", "Lake Havasu",
    "Lake Tahoe", "Lake Shasta", "Lake George",
    "Lake Winnipesaukee", "Lake Lanier", "Lake Minnetonka",
    "Lake of the Ozarks", "Lake Chelan", "Lake Coeur d'Alene",
    "Lake Texoma", "Lake Granby", "Lake Cumberland",
    "Lake Vermilion", "Lake Gaston", "Lake Anna",
    "Lake Winnisquam", "Lake Martin",
    "Lake Wylie", "Lake Wallenpaupack", "Lake Winnibigoshish",
    "Lake Winnebago", "Lake Guntersville", "Lake Mille Lacs",
    "Lake Oconee", "Lake Keowee", "Lake Chautauqua",
    "Lake Seminole", "Lake Livingston",
    "Lake Sam Rayburn", "Lake Conroe", "Lake Norman",
    "Lake Allatoona", "Lake Fork", "Lake Moultrie",
    "Lake Hartwell", "Lake St. Clair", "Lake Wawasee", "Lake of Egypt",
    "Lake Hamilton", "Lake Amistad", "Lake Wateree", "Lake Barkley",
    "Lake Berryessa", "Lake LBJ", 
    "Lake Murray", "Lake Palestine", "Lake Sinclair", 
]

states_list = [
    "Alabama", "Alaska", "Arizona",
    "Arkansas", "California", "Colorado",
    "Connecticut", "Delaware", "Florida",
    "Georgia", "Hawaii", "Idaho",
    "Illinois", "Indiana", "Iowa",
    "Kansas", "Kentucky", "Louisiana",
    "Maine", "Maryland", "Massachusetts",
    "Michigan", "Minnesota", "Mississippi",
    "Missouri", "Montana", "Nebraska",
    "Nevada", "New Hampshire", "New Jersey",
    "New Mexico", "New York", "North Carolina",
    "North Dakota", "Ohio", "Oklahoma",
    "Oregon", "Pennsylvania", "Rhode Island",
    "South Carolina", "South Dakota", "Tennessee",
    "Texas", "Utah", "Vermont",
    "Virginia", "Washington", "West Virginia",
    "Wisconsin", "Wyoming"
]

status_list = ['pending', 'approved', 'approved']

def create_users():
    users = []

    for i in range(20):
        user = User(
            username=fake.name()
        )
        user.password_hash=fake.phone_number()
        users.append(user)
    return users


def create_lakes():
    latitude_list = [
    44.500000, 39.000000, 44.000000, 31.000000, 44.500000, 41.742325, 44.000000, 43.000000, 44.000000,
    41.500000, 38.500000, 33.000000, 40.000000, 39.000000, 41.599998, 34.799999, 40.273502, 38.573936,
    27.994402, 39.876019, 45.367584, 44.182205, 33.247875, 19.741755, 66.160507, 35.860119, 37.926868,
    39.833851, 37.839333, 47.650589, 46.392410, 36.084621, 46.965260, 47.751076, 39.419220, 39.113014,
    40.367474, 32.318230, 42.032974, 34.307144, 33.836082, 41.203323, 34.048927, 39.045753, 42.407211,
    36.778259, 44.068203, 43.075970, 35.782169, 30.391830
    ]

    longitude_list = [
    -89.500000, -80.500000, -72.699997, -100.000000, -100.000000, -71.742332, -120.500000, -75.000000,
    -71.500000, -100.000000, -98.000000, -90.000000, -89.000000, -75.500000, -72.699997, -92.199997,
    -86.126976, -92.603760, -81.760254, -117.224121, -68.972168, -84.506836, -83.441162, -155.844437,
    -153.369141, -86.660156, -78.024902, -74.871826, -84.270020, -100.437012, -94.636230, -96.921387,
    -109.533691, -120.740135, -111.950684, -105.358887, -82.996216, -86.902298, -93.581543, -106.018066,
    -81.163727, -77.194527, -111.093735, -76.641273, -71.382439, -119.417931, -114.742043, -107.290283,
    -80.793457, -92.329102
    ]

    lakes_list = []

    for i in range(0, 50):
        lake = Lake(
           name=lakes[i],
           lat=latitude_list[i],
           lng=longitude_list[i],
           city=fake.city(),
           state=rc(states_list),
           zip_code=fake.postcode(),
           status=rc(status_list)
        )
        lakes_list.append(lake)
    return lakes_list

def create_fish():
    list_fish = []

    for i in range(0, 100):
        fish = Fish(
            name=fish_list[i],
            min_length=randint(5, 20),
            max_length=randint(20, 30),
            daily_limit=randint(10, 30),
            status=rc(status_list)
        )
        list_fish.append(fish)
    return list_fish

def create_reviews():
    reviews_list = []

    for i in range(75):
        review = Review(
            rating=randint(0, 5),
            text=fake.sentence(),
            user_id=randint(1, 20),
            lake_id=randint(1, 100)
        )
        reviews_list.append(review)
    return reviews_list

def create_messages():
    message_list = []

    for i in range(200):
        message = Message(
            text=fake.sentence(),
            user_id=randint(1, 20),
            lake_id=randint(1, 100)
        )
        message_list.append(message)
    return message_list

def create_favorites():
    fave_list = []

    for i in range(30):
        fave = Favorite(
            user_id=randint(1, 20),
            lake_id=randint(1, 100)
        )
        fave_list.append(fave)
    return fave_list

# def create_edit():
#     edits_list = []

#     for i in range(30):
#         edit = Edit(
#             what=fake.sentence(),
#             user_id=randint(1, 20)
#         )
#         if i % 2 == 0:
#             edit.fish_id = randint(1, 200)
#         else:
#             edit.lake_id = randint(1, 100)
        
#         edits_list.append(edit)
#     return edits_list

def create_fish_lakes():
    fish_lakes = []

    for i in range(100):
        fish_lake = FishLake(
            fish_id=randint(1, 100),
            lake_id=randint(1, 100)
        )
        fish_lakes.append(fish_lake)
    return fish_lakes


if __name__ == '__main__':
    with app.app_context():
        print('Clearing db...')
        User.query.delete()
        Fish.query.delete()
        Review.query.delete()
        Lake.query.delete()
        Favorite.query.delete()
        Message.query.delete()
        # Edit.query.delete()
        FishLake.query.delete()


        print('seeding db...')
        users = create_users()
        favorites = create_favorites()
        reviews = create_reviews()
        lakes = create_lakes()
        fish = create_fish()
        messages = create_messages()
        # edits = create_edit()
        fish_lake = create_fish_lakes()

        print('adding to db...')
        db.session.add_all(users)
        db.session.add_all(fish)
        db.session.add_all(favorites)
        db.session.add_all(lakes)
        db.session.add_all(reviews)
        db.session.add_all(messages)
        # db.session.add_all(edits)
        db.session.add_all(fish_lake)
        db.session.commit()