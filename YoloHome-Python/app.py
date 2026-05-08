from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from client import aio
from Adafruit_IO.errors import RequestError
from fastapi.middleware.cors import CORSMiddleware
import time

last_updated = time.localtime()
delay = 30
data = []

app = FastAPI()
origins = [
    "http://localhost:8080",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

async def get_group():
    if time.localtime() - last_updated < delay:
        return data

    try:
        data = aio.groups('Default').feeds
        last_updated = time.localtime()
        return data
    except RequestError as e:
        raise HTTPException(status_code=502, detail=str(e))

try:
    data = aio.groups('default')
    last_updated = time.localtime()
    print(data)
except RequestError as e:
    raise HTTPException(status_code=502, detail=str(e))


@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/feeds/nhiet-do")
async def get_nhiet_do():
    # return get_group()[4]
    try:
        data = aio.receive("nhiet-do")
        return {"feed": "nhiet-do", "value": data.value, "created_at": data.created_at}
    except RequestError as e:
        raise HTTPException(status_code=502, detail=str(e))

@app.get("/feeds/lich-su-nhiet-do")
async def get_lich_su_nhiet_do():
    try:
        data = aio.data("nhiet-do")
        return {"feed": "nhiet-do", "value": data}
    except RequestError as e:
        raise HTTPException(status_code=502, detail=str(e))


@app.get("/feeds/do-am")
async def get_do_am():
    try:
        data = aio.receive("do-am")
        return {"feed": "do-am", "value": data.value, "created_at": data.created_at}
    except RequestError as e:
        raise HTTPException(status_code=502, detail=str(e))

@app.get("/feeds/lich-su-do-am")
async def get_lich_su_nhiet_do():
    try:
        data = aio.data("do-am")
        return {"feed": "do-sang", "value": data}
    except RequestError as e:
        raise HTTPException(status_code=502, detail=str(e))

@app.get("/feeds/do-sang")
async def get_do_am():
    try:
        data = aio.receive("do-sang")
        return {"feed": "do-sang", "value": data.value, "created_at": data.created_at}
    except RequestError as e:
        raise HTTPException(status_code=502, detail=str(e))

@app.get("/feeds/lich-su-do-sang")
async def get_lich_su_nhiet_do():
    try:
        data = aio.data("do-sang")
        return {"feed": "do-sang", "value": data}
    except RequestError as e:
        raise HTTPException(status_code=502, detail=str(e))

@app.get("/feeds/den")
async def get_den():
    try:
        data = aio.receive("den")
        return {"feed": "den", "value": data.value, "created_at": data.created_at}
    except RequestError as e:
        raise HTTPException(status_code=502, detail=str(e))

@app.post("/feeds/den")
async def set_den(status: bool):
    try:
        if status not in [0, 1]:
            raise HTTPException(status_code=400, detail="Status must be 0 or 1")
        if status:
            aio.send_data("den", "1")
        else:
            aio.send_data("den", "0")
        return {"feed": "den", "value": int(status)}
    except RequestError as e:
        raise HTTPException(status_code=502, detail=str(e))

@app.get("/feeds/quat")
async def get_quat():
    try:
        data = aio.receive("quat")
        return {"feed": "quat", "value": data.value, "created_at": data.created_at}
    except RequestError as e:
        raise HTTPException(status_code=502, detail=str(e))

@app.post("/feeds/quat")
async def set_quat(status: bool):
    try:
        if status not in [0, 1]:
            raise HTTPException(status_code=400, detail="Status must be 0 or 1")
        if status:
            aio.send_data("quat", "1")
        else:
            aio.send_data("quat", "0")
        return {"feed": "quat", "value": int(status)}
    except RequestError as e:
        raise HTTPException(status_code=502, detail=str(e))

@app.get("/feeds/mode")
async def get_quat():
    try:
        data = aio.receive("mode")
        return {"feed": "mode", "value": data.value, "created_at": data.created_at}
    except RequestError as e:
        raise HTTPException(status_code=502, detail=str(e))

@app.post("/feeds/mode")
async def set_quat(status: bool):
    try:
        if status not in [0, 1]:
            raise HTTPException(status_code=400, detail="Status must be 0 or 1")
        if status:
            aio.send_data("mode", "1")
        else:
            aio.send_data("mode", "0")
        return {"feed": "mode", "value": int(status)}
    except RequestError as e:
        raise HTTPException(status_code=502, detail=str(e))
