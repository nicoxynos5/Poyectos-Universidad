#ifndef TRANSPORT_RX
#define TRANSPORT_RX

#include <string.h>
#include <omnetpp.h>
#include "FeedbackPkt_m.h"

using namespace omnetpp;

class TransportRx: public cSimpleModule {
private:
    cQueue buffer;
    // Events
    cMessage *endServiceEvent;
    cMessage *feedBack;

    simtime_t serviceTime;
    cOutVector bufferSizeVector;
    cOutVector packetDropVector;
public:
    TransportRx();
    virtual ~TransportRx();
protected:
    virtual void initialize();
    virtual void finish();
    virtual void handleMessage(cMessage *msg);
};

Define_Module(TransportRx);

TransportRx::TransportRx() {
    endServiceEvent = NULL;
    feedBack = NULL;
}

TransportRx::~TransportRx() {
    cancelAndDelete(endServiceEvent);
    cancelAndDelete(feedBack);
}

void TransportRx::initialize() {
    buffer.setName("buffer");
    packetDropVector.setName("PERDIDOS");
    bufferSizeVector.setName("bufferSize");
    endServiceEvent = new cMessage("endService");
    feedBack = new cMessage("feedBack");
}

void TransportRx::finish() {
}

void TransportRx::handleMessage(cMessage *msg) {

    // if msg is signaling an endServiceEvent
    if (msg == endServiceEvent) {
        // if packet in buffer, send next one
        if (!buffer.isEmpty()) {
            // dequeue packet
            cPacket *pkt = (cPacket*) buffer.pop();
            // send packet
            send(pkt, "toApp");
            // start new service
            serviceTime = pkt->getDuration();

            FeedbackPkt *feedBack1 = new FeedbackPkt();
            feedBack1->setKind(2);
            feedBack1->setCurrentBufferSize(par("bufferSize").intValue() - buffer.getLength());
            //enviamos mensaje de feedback con información del buffer
            send(feedBack1, "toOut$o");
            scheduleAt(simTime() + serviceTime, endServiceEvent);
        }

    }else { // if msg is a data packet

            if (buffer.getLength() >= par("bufferSize").intValue()){
                //drop the packet
                delete msg;
                this->bubble("packet dropped");
                packetDropVector.record(1);
            } else {
                // enqueue the packet
                buffer.insert(msg);
                bufferSizeVector.record(buffer.getLength());
                // if the server is idle
                if (!endServiceEvent->isScheduled()) {
                    // start the service
                    scheduleAt(simTime() + 0, endServiceEvent);
                }
            }
    }
}

#endif /* TRANSPORT_RX */
