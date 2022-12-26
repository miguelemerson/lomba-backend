import { MongoClient, ServerApiVersion } from "mongodb";
import { UserDataSourceImpl} from '../../../src/data/datasources/user_data_source';
import { UserModel } from "../../../src/data/models/user_model";

describe("User MongoDB DataSource", () => {

    let mockMongoClient: MongoClient

    beforeAll(async () => {
        
        const uri = "mongodb+srv://lomba:ypgZLQkw3NHJElTx@cluster0.j0aztjy.mongodb.net/?retryWrites=true&w=majority";
        mockMongoClient = new MongoClient
        (uri, { serverApi: ServerApiVersion.v1 });
    })

    beforeEach(() => {
        jest.clearAllMocks();
    })

test("crear un usuario", async () => {
    let dataSource = new UserDataSourceImpl(mockMongoClient);
    const user = new UserModel("1", "miguel", "mperedo", "mp@mp.com", true, true);
    const result = dataSource.addUser(user);
    console.log(result);
});

});