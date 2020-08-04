const { default: ClientNode } = require("./ClientNode");

export default class ClientList {
    constructor () {
        this.head = null;
        this.tail = null;
    }

    append (value) {
        const newNode = new ClientNode (value);

        // If there is no head yet let's make new node a head.
        if (!this.head) {
            this.head = newNode;
            this.tail = newNode;
    
            return this;
        }
    
        // Attach new node to the end of linked list.
        this.tail.next = newNode;
    
        // Attach current tail to the new node's previous reference.
        newNode.previous = this.tail;
    
        // Set new node to be the tail of linked list.
        this.tail = newNode;
    
        return this;
    }

    delete (value) {
        if (!this.head) {
            return null;
        }
    
        let deletedNode = null;
        let currentNode = this.head;
    
        while (currentNode) {
            if (currentNode.value === value) {
                deletedNode = currentNode;
        
                if (deletedNode === this.head) {
                // If HEAD is going to be deleted...
        
                // Set head to second node, which will become new head.
                this.head = deletedNode.next;
        
                // Set new head's previous to null.
                if (this.head) {
                    this.head.previous = null;
                }
        
                // If all the nodes in list has same value that is passed as argument
                // then all nodes will get deleted, therefore tail needs to be updated.
                if (deletedNode === this.tail) {
                    this.tail = null;
                }
                } else if (deletedNode === this.tail) {
                // If TAIL is going to be deleted...
        
                // Set tail to second last node, which will become new tail.
                this.tail = deletedNode.previous;
                this.tail.next = null;
                } else {
                // If MIDDLE node is going to be deleted...
                const previousNode = deletedNode.previous;
                const nextNode = deletedNode.next;
        
                previousNode.next = nextNode;
                nextNode.previous = previousNode;
                }
            }
        
            currentNode = currentNode.next;
        }
    
        return deletedNode;
    }

    find ({ value = undefined, callback = undefined }) {
        if (!this.head) {
          return null;
        }
    
        let currentNode = this.head;
    
        while (currentNode) {
          // If callback is specified then try to find node by callback.
          if (callback && callback(currentNode.value)) {
            return currentNode;
          }
    
          // If value is specified then try to compare by value..
          if (value !== undefined && currentNode.value === value) {
            return currentNode;
          }
    
          currentNode = currentNode.next;
        }
    
        return null;
      }
}