import javax.swing.*;

public class Main {
    public static void main(String[] args) {
        JFrame jFrame = new JFrame();

        JButton jButton1 = new JButton("Click me.");
        jButton1.setBounds(120, 100, 100, 40);

        jFrame.add(jButton1);
        jFrame.setSize(500, 500);
        jFrame.setLayout(null);
        jFrame.setVisible(true);
    }
}
