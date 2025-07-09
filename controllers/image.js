import { ClarifaiStub, grpc } from 'clarifai-nodejs-grpc';
import 'dotenv/config';

const PAT = process.env.CLARIFAI_PAT_KEY;
const USER_ID = 'clarifai';
const APP_ID = 'main';
const MODEL_ID = 'face-detection';

export const handleApiCall = (res, req) => {
    const IMAGE_URL = req.body.input;
    console.log("\n...Incoming Request: " + IMAGE_URL + '\n')
    const stub = ClarifaiStub.grpc();

    const metadata = new grpc.Metadata();
    metadata.set('authorization', "Key " + PAT);

    stub.PostModelOutputs(
        {
            user_app_id: {
                "user_id": USER_ID,
                "app_id": APP_ID
            },
            model_id: MODEL_ID,
            inputs: [
                { data: { image: { url: IMAGE_URL, allow_duplicate_url: true}}}
            ]
        },
        metadata,
        (err, response) => {
            if (err) {
                throw new Error(err);
            }
            // if (response.status.code !== 10000) {
            //     throw new Error("Post model outputs failed, status: " + response.status.description);
            // }
            const output = response.outputs[0].data.regions[0].region_info.bounding_box

            return res.json(output)
        }
    )
}

export const handleImage = (req, res, db) => {
    let { id } = req.body;

    db("users")
        .where("id", "=", id)
        .increment("entries", 1)
        .returning("entries")
        .then((entries) => {
            res.json(entries[0].entries);
        })
        .catch((err) => res.status(400).json('unable to get entries'));
};
