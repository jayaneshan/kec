class ListNode {
    int val;
    ListNode next;
    ListNode(int val) {
        this.val = val;
        this.next = null;
    }
}
public class Main {
    public static ListNode insertionSortList(ListNode head) {
        if (head == null) return null;
        // Dummy node to simplify insertion
        ListNode dummy = new ListNode(0);
        ListNode curr = head;

        while (curr != null) {
            ListNode prev = dummy;

            // Find correct position in sorted part
            while (prev.next != null && prev.next.val < curr.val) {
                prev = prev.next;
            }
          // Save next node
            ListNode nextTemp = curr.next;
            // Insert current node
            curr.next = prev.next;
            prev.next = curr;
            // Move to next node
            curr = nextTemp;
        }
        return dummy.next;
    }
    // Helper function to print list
    public static void printList(ListNode head) {
        while (head != null) {
            System.out.print(head.val + " -> ");
            head = head.next;
        }
        System.out.println("null");
    }
    public static void main(String[] args) {
        // Example: 4 -> 2 -> 1 -> 3
        ListNode head = new ListNode(4);
        head.next = new ListNode(2);
        head.next.next = new ListNode(1);
        head.next.next.next = new ListNode(3);

        head = insertionSortList(head);

        printList(head);  // Output: 1 -> 2 -> 3 -> 4 -> null
    }
}
